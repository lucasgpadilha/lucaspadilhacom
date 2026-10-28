export type Locale = 'en' | 'pt';
export type Localized<T> = { en: T; pt: T };

export const t = <T>(value: Localized<T>, locale: Locale): T => value[locale];
export const htmlLang = (locale: Locale) => (locale === 'pt' ? 'pt-BR' : 'en');
export const homePath = (locale: Locale) => (locale === 'pt' ? '/pt/' : '/');

export const SITE = 'https://lucaspadilha.com';
export const absolute = (path: string) => new URL(path, SITE).href;
