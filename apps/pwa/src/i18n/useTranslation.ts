import { useSettingsStore } from '@/app/providers';
import en from './en.json';
import tr from './tr.json';

type DeepKeys<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? DeepKeys<T[K], Prefix extends '' ? K : `${Prefix}.${K}`>
        : never;
    }[keyof T]
  : Prefix;

type TranslationKeys = DeepKeys<typeof en>;

const translations = { en, tr } as const;

function getNestedValue(obj: unknown, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path; // Return key as fallback
    }
  }

  return typeof current === 'string' ? current : path;
}

export function useTranslation() {
  const locale = useSettingsStore((s) => s.locale);

  const t = (key: TranslationKeys): string => {
    const translation = translations[locale];
    return getNestedValue(translation, key);
  };

  return { t, locale };
}
