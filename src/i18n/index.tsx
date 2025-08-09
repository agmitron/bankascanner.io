import React, { createContext, useContext, useMemo, useState } from 'react';
import en from '../locales/en.json';
import ru from '../locales/ru.json';

type Language = 'en' | 'ru';

type Messages = Record<string, any>;

const MESSAGES: Record<Language, Messages> = {
  en,
  ru,
};

function get(obj: Messages, path: string): string | undefined {
  return path.split('.').reduce<any>((acc, key) => (acc && acc[key] != null ? acc[key] : undefined), obj);
}

function detectInitialLanguage(): Language {
  const stored = (typeof window !== 'undefined' && localStorage.getItem('lang')) as Language | null;
  if (stored === 'en' || stored === 'ru') return stored;
  const nav = typeof navigator !== 'undefined' ? navigator.language : 'en';
  return nav.toLowerCase().startsWith('ru') ? 'ru' : 'en';
}

export interface I18nApi {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nApi | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(detectInitialLanguage());

  const setLang = (l: Language) => {
    setLangState(l);
    try {
      localStorage.setItem('lang', l);
    } catch {}
  };

  const api = useMemo<I18nApi>(() => ({
    lang,
    setLang,
    t: (key: string) => {
      const inCurrent = get(MESSAGES[lang], key);
      if (typeof inCurrent === 'string') return inCurrent;
      const inEn = get(MESSAGES.en, key);
      if (typeof inEn === 'string') return inEn;
      return key;
    },
  }), [lang]);

  return <I18nContext.Provider value={api}>{children}</I18nContext.Provider>;
};

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used within I18nProvider');
  return ctx;
}
