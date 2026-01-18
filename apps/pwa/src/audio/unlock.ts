/**
 * Audio unlock utilities - simplified version for Howler.js
 * Howler handles most audio unlock scenarios automatically.
 * This module provides callback hooks for when audio becomes available.
 */

import { Howler } from 'howler';

type AudioUnlockCallback = () => void;
const unlockCallbacks: AudioUnlockCallback[] = [];
let hasTriggeredCallbacks = false;

/**
 * Get the Howler audio context (if available)
 */
export function getAudioContext(): AudioContext | null {
  return Howler.ctx;
}

/**
 * Check if audio is unlocked (Howler context is running)
 */
export function isAudioUnlocked(): boolean {
  const ctx = Howler.ctx;
  return ctx !== null && ctx.state === 'running';
}

/**
 * Attempt to unlock audio - Howler does this automatically on first interaction
 */
export async function unlockAudio(): Promise<void> {
  // Howler unlocks automatically, but we can try to resume context
  const ctx = Howler.ctx;
  if (ctx && ctx.state === 'suspended') {
    try {
      await ctx.resume();
    } catch {
      // Ignore - will be unlocked on user interaction
    }
  }

  if (isAudioUnlocked()) {
    triggerCallbacks();
  }
}

/**
 * Register a callback to be called when audio is unlocked
 */
export function onAudioUnlock(callback: AudioUnlockCallback): () => void {
  // If already unlocked, call immediately
  if (isAudioUnlocked()) {
    callback();
    return () => {};
  }

  unlockCallbacks.push(callback);

  // Set up listeners for user interaction to trigger unlock
  const handleInteraction = async () => {
    await unlockAudio();
    if (isAudioUnlocked()) {
      triggerCallbacks();
      cleanup();
    }
  };

  const events = ['touchstart', 'touchend', 'click', 'keydown'];
  events.forEach((event) => {
    document.addEventListener(event, handleInteraction, { once: false, passive: true });
  });

  const cleanup = () => {
    events.forEach((event) => {
      document.removeEventListener(event, handleInteraction);
    });
  };

  return () => {
    const index = unlockCallbacks.indexOf(callback);
    if (index > -1) {
      unlockCallbacks.splice(index, 1);
    }
  };
}

function triggerCallbacks(): void {
  if (hasTriggeredCallbacks) return;
  hasTriggeredCallbacks = true;

  unlockCallbacks.forEach((cb) => {
    try {
      cb();
    } catch (e) {
      console.warn('Audio unlock callback error:', e);
    }
  });
}

/**
 * Get audio state info for debugging
 */
export function getAudioState(): { contextState: string; unlocked: boolean } {
  const ctx = Howler.ctx;
  return {
    contextState: ctx?.state ?? 'unavailable',
    unlocked: isAudioUnlocked(),
  };
}
