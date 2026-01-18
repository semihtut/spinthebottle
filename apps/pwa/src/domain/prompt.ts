export type PromptType = 'truth' | 'dare';
export type Intensity = 1 | 2 | 3 | 4 | 5;
export type Locale = 'en' | 'tr';

export interface Prompt {
  id: string;
  type: PromptType;
  intensity: Intensity;
  topics: string[];
  constraints: string[];
  durationSec?: number;
  text: Record<Locale, string>;
}

export const TOPICS = [
  'icebreaker',
  'friends',
  'funny',
  'story',
  'preferences',
  'skills',
  'memory',
  'challenge',
  'compliment',
  'creativity',
] as const;

export type Topic = (typeof TOPICS)[number];

export const CONSTRAINTS = [
  'seated',
  'no_touch',
  'no_phone',
  'quiet',
  'small_space',
] as const;

export type Constraint = (typeof CONSTRAINTS)[number];
