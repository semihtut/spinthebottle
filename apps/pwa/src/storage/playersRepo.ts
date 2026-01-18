import { db, type PlayerPreset } from './db';
import type { Player } from '@/domain';

export const playersRepo = {
  async getAllPresets(): Promise<PlayerPreset[]> {
    return db.playerPresets.toArray();
  },

  async getPresetById(id: string): Promise<PlayerPreset | undefined> {
    return db.playerPresets.get(id);
  },

  async savePreset(name: string, players: Player[]): Promise<string> {
    const id = crypto.randomUUID();
    const now = Date.now();

    await db.playerPresets.add({
      id,
      name,
      players,
      createdAt: now,
      updatedAt: now,
    });

    return id;
  },

  async updatePreset(
    id: string,
    updates: Partial<Omit<PlayerPreset, 'id' | 'createdAt'>>
  ): Promise<void> {
    await db.playerPresets.update(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },

  async deletePreset(id: string): Promise<void> {
    await db.playerPresets.delete(id);
  },
};
