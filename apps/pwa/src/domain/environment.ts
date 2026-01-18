import type { Locale } from './prompt';

export interface ColorGrading {
  tint: string;
  glassHue: string;
}

export interface Environment {
  id: string;
  name: Record<Locale, string>;
  backgroundAsset: string;
  surfaceFriction: number;
  colorGrading: ColorGrading;
  audioProfileId: string;
}

export const DEFAULT_ENVIRONMENTS: Environment[] = [
  {
    id: 'desktop',
    name: { en: 'Desktop Table', tr: 'Masa Üstü' },
    backgroundAsset: '/environments/desktop.jpg',
    surfaceFriction: 0.96,
    colorGrading: { tint: 'rgba(255, 200, 150, 0.05)', glassHue: '30' },
    audioProfileId: 'wood',
  },
  {
    id: 'lounge',
    name: { en: 'Authentic Lounge', tr: 'Otantik Salon' },
    backgroundAsset: '/environments/lounge.jpg',
    surfaceFriction: 0.94,
    colorGrading: { tint: 'rgba(180, 100, 80, 0.08)', glassHue: '15' },
    audioProfileId: 'fabric',
  },
  {
    id: 'rooftop',
    name: { en: 'Rooftop City', tr: 'Çatı Katı' },
    backgroundAsset: '/environments/rooftop.jpg',
    surfaceFriction: 0.97,
    colorGrading: { tint: 'rgba(100, 150, 255, 0.05)', glassHue: '220' },
    audioProfileId: 'stone',
  },
];
