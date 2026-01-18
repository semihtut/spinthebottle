export interface AudioProfile {
  id: string;
  spinLoop: string;
  taps: string[];
  settle: string;
  ambience: string;
}

export const AUDIO_PROFILES: Record<string, AudioProfile> = {
  wood: {
    id: 'wood',
    spinLoop: '/audio/wood/spin-loop.wav',
    taps: [
      '/audio/wood/tap-1.wav',
      '/audio/wood/tap-2.wav',
      '/audio/wood/tap-3.wav',
    ],
    settle: '/audio/wood/settle.wav',
    ambience: '/audio/wood/ambience.wav',
  },
  fabric: {
    id: 'fabric',
    spinLoop: '/audio/fabric/spin-loop.wav',
    taps: [
      '/audio/fabric/tap-1.wav',
      '/audio/fabric/tap-2.wav',
      '/audio/fabric/tap-3.wav',
    ],
    settle: '/audio/fabric/settle.wav',
    ambience: '/audio/fabric/ambience.wav',
  },
  stone: {
    id: 'stone',
    spinLoop: '/audio/stone/spin-loop.wav',
    taps: [
      '/audio/stone/tap-1.wav',
      '/audio/stone/tap-2.wav',
      '/audio/stone/tap-3.wav',
    ],
    settle: '/audio/stone/settle.wav',
    ambience: '/audio/stone/ambience.wav',
  },
};
