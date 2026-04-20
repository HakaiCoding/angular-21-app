import type { TranslationKey } from '../../i18n/types';

export type ApiErrorKind = 'network' | 'timeout' | 'http' | 'unknown';

export interface ApiError {
  kind: ApiErrorKind;
  i18nKey: TranslationKey;
  message?: string;
  retryable: boolean;
  status?: number;
  url?: string;
}

export const isApiError = (error: unknown): error is ApiError => {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  return (
    'kind' in error &&
    'i18nKey' in error &&
    'retryable' in error &&
    typeof (error as { kind: unknown }).kind === 'string' &&
    typeof (error as { i18nKey: unknown }).i18nKey === 'string' &&
    typeof (error as { retryable: unknown }).retryable === 'boolean'
  );
};
