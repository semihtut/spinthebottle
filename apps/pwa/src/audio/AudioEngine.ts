import { Howl, Howler } from 'howler';
import { AUDIO_PROFILES, type AudioProfile } from './profiles';
import { clamp } from '@/utils/clamp';

interface AudioEngineConfig {
  sfxVolume: number;
  ambienceVolume: number;
  masterMuted: boolean;
}

/**
 * AudioEngine - Manages all game audio using Howler.js.
 * Features:
 * - Velocity-mapped spin loop with rate adjustment
 * - Randomized tap samples
 * - Environment-specific audio profiles
 * - Ambience loops with crossfade
 * - Automatic iOS audio unlock handling via Howler
 */
export class AudioEngine {
  private config: AudioEngineConfig = {
    sfxVolume: 0.8,
    ambienceVolume: 0.3,
    masterMuted: false,
  };

  // Loaded Howl instances per profile
  private spinLoopHowl: Howl | null = null;
  private spinLoopId: number | null = null;
  private settleHowl: Howl | null = null;
  private ambienceHowl: Howl | null = null;
  private ambienceId: number | null = null;
  private tapHowls: Howl[] = [];

  private currentProfile: AudioProfile | null = null;
  private loadingPromise: Promise<void> | null = null;

  // Settings
  private initialized = false;
  private maxVelocity = 15; // radians per second at max spin

  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Howler handles audio context unlock automatically
    // Just set the global volume
    this.updateVolumes();
    this.initialized = true;
  }

  setConfig(config: Partial<AudioEngineConfig>): void {
    this.config = { ...this.config, ...config };
    this.updateVolumes();
  }

  private updateVolumes(): void {
    // Set global mute state
    Howler.mute(this.config.masterMuted);

    // Update ambience volume (spin loop volume is controlled by velocity)
    if (this.ambienceHowl && this.ambienceId !== null) {
      this.ambienceHowl.volume(this.config.ambienceVolume, this.ambienceId);
    }
  }

  async loadProfile(profileId: string): Promise<void> {
    const profile = AUDIO_PROFILES[profileId];
    if (!profile) return;

    // Wait for any existing loading to complete
    if (this.loadingPromise) {
      await this.loadingPromise;
    }

    // Don't reload if same profile
    if (this.currentProfile?.id === profileId) return;

    this.currentProfile = profile;

    // Unload previous sounds
    this.unloadCurrentSounds();

    // Load all audio files for this profile
    this.loadingPromise = this.loadProfileAssets(profile);
    await this.loadingPromise;
    this.loadingPromise = null;
  }

  private unloadCurrentSounds(): void {
    this.spinLoopHowl?.unload();
    this.spinLoopHowl = null;
    this.spinLoopId = null;

    this.settleHowl?.unload();
    this.settleHowl = null;

    this.ambienceHowl?.unload();
    this.ambienceHowl = null;
    this.ambienceId = null;

    this.tapHowls.forEach((h) => h.unload());
    this.tapHowls = [];
  }

  private async loadProfileAssets(profile: AudioProfile): Promise<void> {
    const loadPromises: Promise<void>[] = [];

    // Load spin loop
    loadPromises.push(
      new Promise((resolve) => {
        this.spinLoopHowl = new Howl({
          src: [profile.spinLoop],
          loop: true,
          volume: 0,
          preload: true,
          onload: () => resolve(),
          onloaderror: () => {
            console.warn(`Failed to load spin loop: ${profile.spinLoop}`);
            resolve();
          },
        });
      })
    );

    // Load settle sound
    loadPromises.push(
      new Promise((resolve) => {
        this.settleHowl = new Howl({
          src: [profile.settle],
          volume: this.config.sfxVolume,
          preload: true,
          onload: () => resolve(),
          onloaderror: () => {
            console.warn(`Failed to load settle: ${profile.settle}`);
            resolve();
          },
        });
      })
    );

    // Load ambience
    loadPromises.push(
      new Promise((resolve) => {
        this.ambienceHowl = new Howl({
          src: [profile.ambience],
          loop: true,
          volume: 0,
          preload: true,
          onload: () => resolve(),
          onloaderror: () => {
            console.warn(`Failed to load ambience: ${profile.ambience}`);
            resolve();
          },
        });
      })
    );

    // Load tap sounds
    for (const tapUrl of profile.taps) {
      loadPromises.push(
        new Promise((resolve) => {
          const tapHowl = new Howl({
            src: [tapUrl],
            volume: this.config.sfxVolume,
            preload: true,
            onload: () => resolve(),
            onloaderror: () => {
              console.warn(`Failed to load tap: ${tapUrl}`);
              resolve();
            },
          });
          this.tapHowls.push(tapHowl);
        })
      );
    }

    await Promise.all(loadPromises);
  }

  getCurrentProfileId(): string | null {
    return this.currentProfile?.id ?? null;
  }

  // ============ Spin Audio ============

  playSpinLoop(initialVelocity: number): void {
    if (!this.spinLoopHowl || this.spinLoopId !== null) return;

    // Start playing
    this.spinLoopId = this.spinLoopHowl.play();

    // Set initial velocity
    this.updateSpinVelocity(initialVelocity);
  }

  stopSpinLoop(): void {
    if (!this.spinLoopHowl || this.spinLoopId === null) return;

    // Fade out
    this.spinLoopHowl.fade(
      this.spinLoopHowl.volume(this.spinLoopId) as number,
      0,
      200,
      this.spinLoopId
    );

    // Stop after fade
    const idToStop = this.spinLoopId;
    setTimeout(() => {
      this.spinLoopHowl?.stop(idToStop);
    }, 200);

    this.spinLoopId = null;
  }

  updateSpinVelocity(velocity: number): void {
    if (!this.spinLoopHowl || this.spinLoopId === null) return;

    const normalizedVel = clamp(velocity / this.maxVelocity, 0, 1);

    // Volume: 0 at rest, sfxVolume * 0.8 at max
    const targetGain = normalizedVel * this.config.sfxVolume * 0.8;
    this.spinLoopHowl.volume(targetGain, this.spinLoopId);

    // Playback rate: 0.8 at rest, 1.2 at max (subtle pitch shift for speed feel)
    const targetRate = 0.8 + normalizedVel * 0.4;
    this.spinLoopHowl.rate(targetRate, this.spinLoopId);
  }

  // ============ One-shot Sounds ============

  playTap(intensity: number = 1): void {
    if (this.tapHowls.length === 0) return;

    // Pick random tap
    const tapHowl = this.tapHowls[Math.floor(Math.random() * this.tapHowls.length)];
    const id = tapHowl.play();

    // Set volume based on intensity
    tapHowl.volume(clamp(intensity, 0.3, 1) * this.config.sfxVolume, id);
  }

  playSettle(): void {
    if (!this.settleHowl) return;

    this.settleHowl.volume(this.config.sfxVolume);
    this.settleHowl.play();
  }

  playUISound(_type: 'tap' | 'success' | 'error'): void {
    // UI sounds would use separate assets - for now, skip if not loaded
    // Could add ui-tap.mp3, ui-success.mp3 etc. to profiles
  }

  // ============ Ambience ============

  playAmbience(): void {
    if (!this.ambienceHowl || this.ambienceId !== null) return;

    // Start at 0 volume
    this.ambienceHowl.volume(0);
    this.ambienceId = this.ambienceHowl.play();

    // Fade in
    this.ambienceHowl.fade(0, this.config.ambienceVolume, 1000, this.ambienceId);
  }

  stopAmbience(): void {
    if (!this.ambienceHowl || this.ambienceId === null) return;

    // Fade out
    this.ambienceHowl.fade(
      this.ambienceHowl.volume(this.ambienceId) as number,
      0,
      500,
      this.ambienceId
    );

    // Stop after fade
    const idToStop = this.ambienceId;
    setTimeout(() => {
      this.ambienceHowl?.stop(idToStop);
    }, 500);

    this.ambienceId = null;
  }

  crossfadeAmbience(newProfileId: string): void {
    // Stop current ambience with fade
    this.stopAmbience();

    // Load new profile and start ambience after a short delay
    setTimeout(async () => {
      await this.loadProfile(newProfileId);
      this.playAmbience();
    }, 300);
  }

  // ============ Lifecycle ============

  dispose(): void {
    this.stopSpinLoop();
    this.stopAmbience();
    this.unloadCurrentSounds();
    this.currentProfile = null;
    this.initialized = false;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

export const audioEngine = new AudioEngine();
