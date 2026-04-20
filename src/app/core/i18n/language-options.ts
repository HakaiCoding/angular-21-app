const APP_LANGUAGE_OPTIONS_DATA = [
  { code: 'en', label: 'English', flagUrl: '/assets/language-flags/en.svg' },
  { code: 'fr', label: 'Français', flagUrl: '/assets/language-flags/fr.svg' },
  { code: 'de', label: 'Deutsch', flagUrl: '/assets/language-flags/de.svg' },
  { code: 'es', label: 'Español', flagUrl: '/assets/language-flags/es.svg' },
  { code: 'it', label: 'Italiano', flagUrl: '/assets/language-flags/it.svg' },
] as const;

export type AppLanguageCode = (typeof APP_LANGUAGE_OPTIONS_DATA)[number]['code'];

export interface AppLanguageOption {
  code: AppLanguageCode;
  label: string;
  flagUrl: string;
}

export const APP_LANGUAGE_OPTIONS: readonly AppLanguageOption[] = APP_LANGUAGE_OPTIONS_DATA;

export const APP_AVAILABLE_LANGUAGE_CODES: AppLanguageCode[] = APP_LANGUAGE_OPTIONS.map(
  (language) => language.code,
);

export const APP_DEFAULT_LANGUAGE = APP_LANGUAGE_OPTIONS[0];
