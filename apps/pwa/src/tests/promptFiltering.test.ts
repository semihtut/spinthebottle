import { describe, it, expect } from 'vitest';
import { filterPromptsByRules, selectRandomPrompt } from '../data/promptRepository';
import type { Prompt, HouseRules } from '../domain';

// Helper to create test prompts
function createPrompt(overrides: Partial<Prompt> = {}): Prompt {
  return {
    id: `prompt-${Math.random().toString(36).substr(2, 9)}`,
    type: 'truth',
    text: { en: 'Test prompt', tr: 'Test sorusu' },
    intensity: 2,
    topics: [],
    constraints: [],
    ...overrides,
  };
}

// Default house rules for testing
const defaultRules: HouseRules = {
  intensityMax: 3,
  disabledTopics: [],
  constraints: [],
};

describe('filterPromptsByRules', () => {
  describe('intensity filtering', () => {
    it('should include prompts at or below max intensity level 1', () => {
      const prompts = [
        createPrompt({ intensity: 1 }),
        createPrompt({ intensity: 2 }),
        createPrompt({ intensity: 3 }),
        createPrompt({ intensity: 4 }),
        createPrompt({ intensity: 5 }),
      ];

      const rules: HouseRules = { ...defaultRules, intensityMax: 1 };
      const filtered = filterPromptsByRules(prompts, rules);

      // intensityMax 1 = prompts 1-2
      expect(filtered.length).toBe(2);
      expect(filtered.every((p) => p.intensity <= 2)).toBe(true);
    });

    it('should include prompts at or below max intensity level 2', () => {
      const prompts = [
        createPrompt({ intensity: 1 }),
        createPrompt({ intensity: 2 }),
        createPrompt({ intensity: 3 }),
        createPrompt({ intensity: 4 }),
        createPrompt({ intensity: 5 }),
      ];

      const rules: HouseRules = { ...defaultRules, intensityMax: 2 };
      const filtered = filterPromptsByRules(prompts, rules);

      // intensityMax 2 = prompts 1-3
      expect(filtered.length).toBe(3);
      expect(filtered.every((p) => p.intensity <= 3)).toBe(true);
    });

    it('should include all prompts at max intensity level 3', () => {
      const prompts = [
        createPrompt({ intensity: 1 }),
        createPrompt({ intensity: 2 }),
        createPrompt({ intensity: 3 }),
        createPrompt({ intensity: 4 }),
        createPrompt({ intensity: 5 }),
      ];

      const rules: HouseRules = { ...defaultRules, intensityMax: 3 };
      const filtered = filterPromptsByRules(prompts, rules);

      // intensityMax 3 = prompts 1-5 (all)
      expect(filtered.length).toBe(5);
    });
  });

  describe('topic filtering', () => {
    it('should exclude prompts with disabled topics', () => {
      const prompts = [
        createPrompt({ topics: ['icebreaker'] }),
        createPrompt({ topics: ['funny'] }),
        createPrompt({ topics: ['icebreaker', 'friends'] }),
        createPrompt({ topics: [] }),
      ];

      const rules: HouseRules = {
        ...defaultRules,
        disabledTopics: ['icebreaker'],
      };
      const filtered = filterPromptsByRules(prompts, rules);

      expect(filtered.length).toBe(2);
      expect(filtered.some((p) => p.topics.includes('icebreaker'))).toBe(false);
    });

    it('should include all prompts when no topics disabled', () => {
      const prompts = [
        createPrompt({ topics: ['icebreaker'] }),
        createPrompt({ topics: ['funny'] }),
        createPrompt({ topics: [] }),
      ];

      const rules: HouseRules = { ...defaultRules, disabledTopics: [] };
      const filtered = filterPromptsByRules(prompts, rules);

      expect(filtered.length).toBe(3);
    });

    it('should handle multiple disabled topics', () => {
      const prompts = [
        createPrompt({ topics: ['icebreaker'] }),
        createPrompt({ topics: ['challenge'] }),
        createPrompt({ topics: ['funny'] }),
        createPrompt({ topics: ['icebreaker', 'challenge'] }),
      ];

      const rules: HouseRules = {
        ...defaultRules,
        disabledTopics: ['icebreaker', 'challenge'],
      };
      const filtered = filterPromptsByRules(prompts, rules);

      expect(filtered.length).toBe(1);
      expect(filtered[0].topics).toContain('funny');
    });
  });

  describe('constraint filtering', () => {
    it('should exclude prompts with incompatible constraints when rules have constraints', () => {
      const prompts = [
        createPrompt({ constraints: ['seated'] }),
        createPrompt({ constraints: ['no_phone'] }),
        createPrompt({ constraints: [] }),
      ];

      const rules: HouseRules = {
        ...defaultRules,
        constraints: ['seated'],
      };
      const filtered = filterPromptsByRules(prompts, rules);

      // Should include: prompts with no constraints or with only allowed constraints
      expect(filtered.length).toBe(2);
    });

    it('should include all prompts when no rule constraints set', () => {
      const prompts = [
        createPrompt({ constraints: ['seated'] }),
        createPrompt({ constraints: ['no_phone'] }),
        createPrompt({ constraints: [] }),
      ];

      const rules: HouseRules = { ...defaultRules, constraints: [] };
      const filtered = filterPromptsByRules(prompts, rules);

      expect(filtered.length).toBe(3);
    });
  });

  describe('combined filtering', () => {
    it('should apply all filters together', () => {
      const prompts = [
        createPrompt({ intensity: 5, topics: ['icebreaker'], constraints: [] }), // excluded by intensity
        createPrompt({ intensity: 1, topics: ['funny'], constraints: [] }), // included
        createPrompt({ intensity: 2, topics: ['icebreaker'], constraints: [] }), // excluded by topic
        createPrompt({ intensity: 1, topics: [], constraints: [] }), // included
      ];

      const rules: HouseRules = {
        intensityMax: 1, // allows intensity 1-2
        disabledTopics: ['icebreaker'],
        constraints: [],
      };
      const filtered = filterPromptsByRules(prompts, rules);

      // Should include: intensity 1-2, no icebreaker
      expect(filtered.length).toBe(2);
    });

    it('should filter by constraints when rules have constraints', () => {
      const prompts = [
        createPrompt({ intensity: 1, topics: [], constraints: [] }), // included
        createPrompt({ intensity: 1, topics: [], constraints: ['no_phone'] }), // excluded
        createPrompt({ intensity: 1, topics: [], constraints: ['seated'] }), // included
      ];

      const rules: HouseRules = {
        intensityMax: 3,
        disabledTopics: [],
        constraints: ['seated'], // only allow seated
      };
      const filtered = filterPromptsByRules(prompts, rules);

      // Should include: no constraints OR only allowed constraints
      expect(filtered.length).toBe(2);
    });
  });
});

describe('selectRandomPrompt', () => {
  it('should return null for empty prompt array', () => {
    const result = selectRandomPrompt([], [], 5);
    expect(result).toBeNull();
  });

  it('should return a prompt from the array', () => {
    const prompts = [createPrompt(), createPrompt(), createPrompt()];
    const result = selectRandomPrompt(prompts, [], 5);

    expect(result).not.toBeNull();
    expect(prompts.some((p) => p.id === result?.id)).toBe(true);
  });

  it('should avoid recently used prompts when possible', () => {
    const prompts = [
      createPrompt({ id: 'p1' }),
      createPrompt({ id: 'p2' }),
      createPrompt({ id: 'p3' }),
    ];

    // Mark p1 and p2 as recently used
    const recentlyUsed = ['p1', 'p2'];

    // Run many times to check that p3 is selected (probabilistically should always be p3)
    for (let i = 0; i < 10; i++) {
      const result = selectRandomPrompt(prompts, recentlyUsed, 5);
      expect(result?.id).toBe('p3');
    }
  });

  it('should allow any prompt when all are recently used', () => {
    const prompts = [createPrompt({ id: 'p1' }), createPrompt({ id: 'p2' })];

    const recentlyUsed = ['p1', 'p2'];
    const result = selectRandomPrompt(prompts, recentlyUsed, 5);

    expect(result).not.toBeNull();
    expect(['p1', 'p2']).toContain(result?.id);
  });

  it('should respect maxRecentToAvoid parameter', () => {
    const prompts = [
      createPrompt({ id: 'p1' }),
      createPrompt({ id: 'p2' }),
      createPrompt({ id: 'p3' }),
    ];

    // p1 is oldest, should not be avoided with maxRecentToAvoid=1
    const recentlyUsed = ['p1', 'p2', 'p3'];

    // With maxRecentToAvoid=1, only p3 should be avoided
    // Run to verify p1 can be selected
    let foundP1 = false;
    for (let i = 0; i < 50; i++) {
      const result = selectRandomPrompt(prompts, recentlyUsed, 1);
      if (result?.id === 'p1' || result?.id === 'p2') {
        foundP1 = true;
        break;
      }
    }
    expect(foundP1).toBe(true);
  });
});
