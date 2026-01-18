import { db, initializeDefaultPacks } from '@/storage/db';
import type { Pack, Prompt, HouseRules } from '@/domain';
import { DEFAULT_PACKS } from './defaultPacks';

/**
 * Initialize the database with default packs if needed
 */
export async function initializePrompts(): Promise<void> {
  await initializeDefaultPacks(DEFAULT_PACKS);
}

/**
 * Get all packs from the database
 */
export async function getAllPacks(): Promise<Pack[]> {
  return db.packs.toArray();
}

/**
 * Get enabled packs only
 */
export async function getEnabledPacks(): Promise<Pack[]> {
  // Use filter instead of index - Dexie indexes booleans inconsistently
  const allPacks = await db.packs.toArray();
  return allPacks.filter(pack => pack.isEnabled === true);
}

/**
 * Toggle pack enabled state
 */
export async function togglePack(packId: string, enabled: boolean): Promise<void> {
  await db.packs.update(packId, { isEnabled: enabled });
}

/**
 * Get a single pack by ID
 */
export async function getPackById(packId: string): Promise<Pack | undefined> {
  return db.packs.get(packId);
}

/**
 * Filter prompts based on house rules
 */
export function filterPromptsByRules(prompts: Prompt[], rules: HouseRules): Prompt[] {
  return prompts.filter((prompt) => {
    // Filter by intensity (rules use 1-3, prompts use 1-5)
    // Map rules intensity: 1 = prompts 1-2, 2 = prompts 1-3, 3 = prompts 1-5
    const maxPromptIntensity = rules.intensityMax === 1 ? 2 : rules.intensityMax === 2 ? 3 : 5;
    if (prompt.intensity > maxPromptIntensity) {
      return false;
    }

    // Filter by disabled topics
    if (rules.disabledTopics.length > 0) {
      const hasDisabledTopic = prompt.topics.some((topic) =>
        rules.disabledTopics.includes(topic as any)
      );
      if (hasDisabledTopic) {
        return false;
      }
    }

    // Filter by constraints (only include prompts compatible with active constraints)
    if (rules.constraints.length > 0) {
      const hasIncompatibleConstraint = prompt.constraints.some(
        (constraint) => !rules.constraints.includes(constraint as any)
      );
      if (hasIncompatibleConstraint) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Get all available prompts from enabled packs, filtered by house rules
 */
export async function getFilteredPrompts(
  type: 'truth' | 'dare',
  rules: HouseRules
): Promise<Prompt[]> {
  const enabledPacks = await getEnabledPacks();

  // Collect all prompts of the specified type
  const allPrompts: Prompt[] = [];
  for (const pack of enabledPacks) {
    for (const prompt of pack.prompts) {
      if (prompt.type === type) {
        allPrompts.push(prompt);
      }
    }
  }

  // Apply filters
  return filterPromptsByRules(allPrompts, rules);
}

/**
 * Select a random prompt, avoiding recently used ones
 */
export function selectRandomPrompt(
  prompts: Prompt[],
  recentlyUsedIds: string[],
  maxRecentToAvoid: number = 5
): Prompt | null {
  if (prompts.length === 0) return null;

  // Filter out recently used (but only if we have enough options)
  const idsToAvoid = new Set(recentlyUsedIds.slice(-maxRecentToAvoid));
  let available = prompts.filter((p) => !idsToAvoid.has(p.id));

  // If all prompts were recently used, allow any
  if (available.length === 0) {
    available = prompts;
  }

  // Random selection
  const index = Math.floor(Math.random() * available.length);
  return available[index];
}

/**
 * Prompt selector class for managing prompt selection state
 */
export class PromptSelector {
  private recentlyUsedTruths: string[] = [];
  private recentlyUsedDares: string[] = [];
  private maxRecent = 10;

  /**
   * Select a prompt of the given type
   */
  async select(type: 'truth' | 'dare', rules: HouseRules): Promise<Prompt | null> {
    const prompts = await getFilteredPrompts(type, rules);
    const recentlyUsed = type === 'truth' ? this.recentlyUsedTruths : this.recentlyUsedDares;

    const selected = selectRandomPrompt(prompts, recentlyUsed, this.maxRecent);

    if (selected) {
      // Track as recently used
      if (type === 'truth') {
        this.recentlyUsedTruths.push(selected.id);
        if (this.recentlyUsedTruths.length > this.maxRecent * 2) {
          this.recentlyUsedTruths = this.recentlyUsedTruths.slice(-this.maxRecent);
        }
      } else {
        this.recentlyUsedDares.push(selected.id);
        if (this.recentlyUsedDares.length > this.maxRecent * 2) {
          this.recentlyUsedDares = this.recentlyUsedDares.slice(-this.maxRecent);
        }
      }
    }

    return selected;
  }

  /**
   * Reset the recently used tracking
   */
  reset(): void {
    this.recentlyUsedTruths = [];
    this.recentlyUsedDares = [];
  }

  /**
   * Get count of available prompts for each type
   */
  async getAvailableCounts(rules: HouseRules): Promise<{ truths: number; dares: number }> {
    const truths = await getFilteredPrompts('truth', rules);
    const dares = await getFilteredPrompts('dare', rules);
    return {
      truths: truths.length,
      dares: dares.length,
    };
  }
}

// Singleton instance
export const promptSelector = new PromptSelector();
