// Settings are persisted via Zustand's persist middleware
// This file provides additional utilities for settings management

const SETTINGS_KEY = 'settings-store';

export const settingsRepo = {
  async clear(): Promise<void> {
    localStorage.removeItem(SETTINGS_KEY);
  },

  async export(): Promise<string> {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data || '{}';
  },

  async import(jsonString: string): Promise<void> {
    try {
      const parsed = JSON.parse(jsonString);
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed));
    } catch (e) {
      throw new Error('Invalid settings data');
    }
  },
};
