export interface ApiNetworkError {
  kind: 'network';
  retryable: true;
  status: 0;
  url?: string;
}

export interface ApiTimeoutError {
  kind: 'timeout';
  retryable: true;
  url?: string;
}

export interface ApiHttpError {
  kind: 'http';
  retryable: boolean;
  status: number;
  message?: string;
  url?: string;
}

export interface ApiUnknownError {
  kind: 'unknown';
  retryable: false;
  message?: string;
  url?: string;
}

export type ApiError =
  | ApiNetworkError
  | ApiTimeoutError
  | ApiHttpError
  | ApiUnknownError;

export const isApiError = (error: unknown): error is ApiError => {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const candidate = error as Partial<ApiError> & {
    status?: unknown;
    retryable?: unknown;
    message?: unknown;
    url?: unknown;
  };

  if (
    typeof candidate.kind !== 'string'
    || typeof candidate.retryable !== 'boolean'
    || (candidate.message !== undefined && typeof candidate.message !== 'string')
    || (candidate.url !== undefined && typeof candidate.url !== 'string')
  ) {
    return false;
  }

  switch (candidate.kind) {
    case 'network':
      return candidate.retryable === true && candidate.status === 0;
    case 'timeout':
      return candidate.retryable === true && candidate.status === undefined;
    case 'http':
      return typeof candidate.status === 'number';
    case 'unknown':
      return candidate.retryable === false && candidate.status === undefined;
    default:
      return false;
  }
};

export const toApiError = (error: unknown): ApiError => {
  if (isApiError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return {
      kind: 'unknown',
      retryable: false,
      message: error.message || undefined,
    };
  }

  return {
    kind: 'unknown',
    retryable: false,
  };
};
