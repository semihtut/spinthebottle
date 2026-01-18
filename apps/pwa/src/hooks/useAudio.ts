import { useEffect, useCallback, useRef } from 'react';
import { useSettingsStore } from '@/app/providers';
import { audioEngine } from '@/audio';
import { onAudioUnlock } from '@/audio/unlock';

export function useAudio() {
  const { sfxVolume, ambienceVolume, masterMuted } = useSettingsStore();
  const initializedRef = useRef(false);

  // Initialize audio engine on unlock
  useEffect(() => {
    const cleanup = onAudioUnlock(async () => {
      if (!initializedRef.current) {
        await audioEngine.initialize();
        initializedRef.current = true;
      }
    });

    return cleanup;
  }, []);

  // Sync settings to audio engine
  useEffect(() => {
    audioEngine.setConfig({
      sfxVolume,
      ambienceVolume,
      masterMuted,
    });
  }, [sfxVolume, ambienceVolume, masterMuted]);

  const loadProfile = useCallback(async (profileId: string) => {
    if (audioEngine.isInitialized()) {
      await audioEngine.loadProfile(profileId);
    }
  }, []);

  const playAmbience = useCallback(() => {
    if (audioEngine.isInitialized()) {
      audioEngine.playAmbience();
    }
  }, []);

  const stopAmbience = useCallback(() => {
    if (audioEngine.isInitialized()) {
      audioEngine.stopAmbience();
    }
  }, []);

  const playSpinLoop = useCallback((velocity: number) => {
    if (audioEngine.isInitialized()) {
      audioEngine.playSpinLoop(velocity);
    }
  }, []);

  const stopSpinLoop = useCallback(() => {
    if (audioEngine.isInitialized()) {
      audioEngine.stopSpinLoop();
    }
  }, []);

  const updateSpinVelocity = useCallback((velocity: number) => {
    if (audioEngine.isInitialized()) {
      audioEngine.updateSpinVelocity(velocity);
    }
  }, []);

  const playTap = useCallback((intensity?: number) => {
    if (audioEngine.isInitialized()) {
      audioEngine.playTap(intensity);
    }
  }, []);

  const playSettle = useCallback(() => {
    if (audioEngine.isInitialized()) {
      audioEngine.playSettle();
    }
  }, []);

  return {
    loadProfile,
    playAmbience,
    stopAmbience,
    playSpinLoop,
    stopSpinLoop,
    updateSpinVelocity,
    playTap,
    playSettle,
    isInitialized: () => audioEngine.isInitialized(),
  };
}
