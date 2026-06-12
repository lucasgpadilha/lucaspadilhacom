import { useEffect, useState } from 'react';

export type Locale = 'en' | 'pt';

const STORAGE_KEY = 'lucaspadilha.locale';
const LOCALE_EVENT = 'lucaspadilha:locale-change';

const portugueseTimezones = new Set([
  'America/Sao_Paulo',
  'America/Fortaleza',
  'America/Recife',
  'America/Belem',
  'America/Maceio',
  'America/Bahia',
  'America/Campo_Grande',
  'America/Cuiaba',
  'America/Manaus',
  'America/Porto_Velho',
  'America/Boa_Vista',
  'America/Rio_Branco',
  'Atlantic/Azores',
  'Atlantic/Madeira',
  'Europe/Lisbon',
]);

const normalizeLocale = (value: string | null | undefined): Locale | null => {
  if (value === 'en' || value === 'pt') return value;
  return null;
};

const localeLooksPortuguese = (value: string) => {
  try {
    const locale = new Intl.Locale(value);
    const language = locale.language.toLowerCase();
    const region = locale.region?.toUpperCase();

    return language === 'pt' || region === 'BR' || region === 'PT';
  } catch {
    return value.toLowerCase().startsWith('pt');
  }
};

const localeLooksEnglish = (value: string) => {
  try {
    return new Intl.Locale(value).language.toLowerCase() === 'en';
  } catch {
    return value.toLowerCase().startsWith('en');
  }
};

export const detectLocale = (): Locale => {
  if (typeof window === 'undefined') return 'en';

  const queryLocale = normalizeLocale(new URLSearchParams(window.location.search).get('lang'));
  if (queryLocale) {
    window.localStorage.setItem(STORAGE_KEY, queryLocale);
    return queryLocale;
  }

  const stored = normalizeLocale(window.localStorage.getItem(STORAGE_KEY));
  if (stored) return stored;

  const languages = window.navigator.languages?.length
    ? window.navigator.languages
    : [window.navigator.language].filter(Boolean);

  const primaryLanguage = languages[0];

  if (primaryLanguage && localeLooksPortuguese(primaryLanguage)) {
    return 'pt';
  }

  if (languages.some(localeLooksEnglish)) {
    return 'en';
  }

  if (languages.some(localeLooksPortuguese)) {
    return 'pt';
  }

  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (portugueseTimezones.has(timezone)) {
      return 'pt';
    }
  } catch {
    return 'en';
  }

  return 'en';
};

export const persistLocale = (locale: Locale) => {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(STORAGE_KEY, locale);
  window.dispatchEvent(new CustomEvent(LOCALE_EVENT, { detail: locale }));
};

export const useLocale = () => {
  const [locale, setLocaleState] = useState<Locale>(() => detectLocale());

  useEffect(() => {
    document.documentElement.lang = locale === 'pt' ? 'pt-BR' : 'en';
  }, [locale]);

  useEffect(() => {
    const handleLocaleChange = (event: Event) => {
      const nextLocale = normalizeLocale((event as CustomEvent<Locale>).detail);
      if (nextLocale) setLocaleState(nextLocale);
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      const nextLocale = normalizeLocale(event.newValue);
      if (nextLocale) setLocaleState(nextLocale);
    };

    window.addEventListener(LOCALE_EVENT, handleLocaleChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(LOCALE_EVENT, handleLocaleChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    persistLocale(nextLocale);
  };

  return { locale, setLocale };
};
