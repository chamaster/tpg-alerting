import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { getTranslations, type Lang, type Translations } from './i18n';

const STORAGE_KEY = 'tpg-lang';

function loadLang(): Lang {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'fr') return stored;
  return 'fr';
}

interface LangContextValue {
  lang: Lang;
  t: Translations;
  toggle: () => void;
}

const LangContext = createContext<LangContextValue>(null!);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(loadLang);

  const toggle = useCallback(() => {
    setLang((prev) => {
      const next = prev === 'fr' ? 'en' : 'fr';
      localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.lang = next;
      return next;
    });
  }, []);

  const t = getTranslations(lang);

  return (
    <LangContext.Provider value={{ lang, t, toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
