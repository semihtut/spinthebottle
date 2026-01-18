export interface Player {
  id: string;
  name: string;
  emoji?: string;
  pronouns?: 'he' | 'she' | 'they' | null;
}

export function createPlayer(name: string, emoji?: string): Player {
  return {
    id: crypto.randomUUID(),
    name,
    emoji,
    pronouns: null,
  };
}
