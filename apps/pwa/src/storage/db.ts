import Dexie, { type EntityTable } from 'dexie';
import type { Pack, Player, Prompt } from '@/domain';

// Database schema with versioning
export class SpinBottleDB extends Dexie {
  packs!: EntityTable<Pack, 'id'>;
  playerPresets!: EntityTable<PlayerPreset, 'id'>;
  customPrompts!: EntityTable<Prompt, 'id'>;

  constructor() {
    super('SpinBottleDB');

    this.version(1).stores({
      packs: 'id, isDefault, isEnabled',
      playerPresets: 'id, name',
      customPrompts: 'id, type, intensity, *topics',
    });
  }
}

export interface PlayerPreset {
  id: string;
  name: string;
  players: Player[];
  createdAt: number;
  updatedAt: number;
}

export const db = new SpinBottleDB();

// Initialize with default packs if empty
export async function initializeDefaultPacks(defaultPacks: Pack[]): Promise<void> {
  const existingPacks = await db.packs.toArray();
  const hasDefaultPacks = existingPacks.some(pack => pack.isDefault === true);
  if (!hasDefaultPacks) {
    // Clear any stale data and add fresh defaults
    await db.packs.clear();
    await db.packs.bulkAdd(defaultPacks);
  }
}
