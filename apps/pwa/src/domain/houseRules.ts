import type { Constraint, Topic } from './prompt';

export interface HouseRules {
  intensityMax: 1 | 2 | 3;
  disabledTopics: Topic[];
  constraints: Constraint[];
}

export const DEFAULT_HOUSE_RULES: HouseRules = {
  intensityMax: 2,
  disabledTopics: [],
  constraints: [],
};
