import type { Locale, Prompt } from './prompt';

export interface Pack {
  id: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  prompts: Prompt[];
  isDefault: boolean;
  isEnabled: boolean;
}
