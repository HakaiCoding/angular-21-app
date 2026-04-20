import type { AppLanguageCode } from '../../i18n/language-options';

export const STORAGE_KEYS = {
  language: 'app.language',
} as const;

export interface AppStorageSchema {
  [STORAGE_KEYS.language]: AppLanguageCode;
}
