export type ApiErrorKind = 'network' | 'timeout' | 'http' | 'unknown';

export interface ApiError {
  kind: ApiErrorKind;
  message: string;
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
    'message' in error &&
    'retryable' in error &&
    typeof (error as { kind: unknown }).kind === 'string' &&
    typeof (error as { message: unknown }).message === 'string' &&
    typeof (error as { retryable: unknown }).retryable === 'boolean'
  );
};
