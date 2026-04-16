export interface AppLanguageOption {
  code: string;
  label: string;
  flagUrl: string;
}

export const APP_LANGUAGE_OPTIONS: readonly AppLanguageOption[] = [
  { code: 'en', label: 'English', flagUrl: '/assets/language-flags/en.svg' },
  { code: 'fr', label: 'Fran\u00e7ais', flagUrl: '/assets/language-flags/fr.svg' },
  { code: 'de', label: 'Deutsch', flagUrl: '/assets/language-flags/de.svg' },
  { code: 'es', label: 'Espa\u00f1ol', flagUrl: '/assets/language-flags/es.svg' },
  { code: 'it', label: 'Italiano', flagUrl: '/assets/language-flags/it.svg' },
];

export const APP_AVAILABLE_LANGUAGE_CODES = APP_LANGUAGE_OPTIONS.map((language) => language.code);

export const APP_DEFAULT_LANGUAGE = APP_LANGUAGE_OPTIONS[0];
