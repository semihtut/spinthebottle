import { db } from './db';
import type { Pack, Prompt, HouseRules, Locale } from '@/domain';

export const packsRepo = {
  async getAll(): Promise<Pack[]> {
    return db.packs.toArray();
  },

  async getEnabled(): Promise<Pack[]> {
    return db.packs.where('isEnabled').equals(1).toArray();
  },

  async getById(id: string): Promise<Pack | undefined> {
    return db.packs.get(id);
  },

  async toggleEnabled(id: string, enabled: boolean): Promise<void> {
    await db.packs.update(id, { isEnabled: enabled });
  },

  async add(pack: Pack): Promise<void> {
    await db.packs.add(pack);
  },

  async update(id: string, updates: Partial<Pack>): Promise<void> {
    await db.packs.update(id, updates);
  },

  async delete(id: string): Promise<void> {
    await db.packs.delete(id);
  },

  async getFilteredPrompts(
    houseRules: HouseRules,
    locale: Locale
  ): Promise<Prompt[]> {
    const enabledPacks = await this.getEnabled();
    const allPrompts = enabledPacks.flatMap((pack) => pack.prompts);

    return allPrompts.filter((prompt) => {
      // Filter by intensity
      if (prompt.intensity > houseRules.intensityMax) {
        return false;
      }

      // Filter by disabled topics
      if (
        houseRules.disabledTopics.some((topic) => prompt.topics.includes(topic))
      ) {
        return false;
      }

      // Filter by constraints (prompt must support active constraints)
      if (
        houseRules.constraints.length > 0 &&
        !houseRules.constraints.every((c) => prompt.constraints.includes(c))
      ) {
        return false;
      }

      // Must have text in the current locale
      if (!prompt.text[locale]) {
        return false;
      }

      return true;
    });
  },

  async getRandomPrompt(
    type: 'truth' | 'dare',
    houseRules: HouseRules,
    locale: Locale,
    excludeIds: string[] = []
  ): Promise<Prompt | null> {
    const prompts = await this.getFilteredPrompts(houseRules, locale);
    const typePrompts = prompts.filter(
      (p) => p.type === type && !excludeIds.includes(p.id)
    );

    if (typePrompts.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * typePrompts.length);
    return typePrompts[randomIndex];
  },
};
