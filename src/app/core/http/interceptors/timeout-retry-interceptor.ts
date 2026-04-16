import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { retry, throwError, timer, TimeoutError, timeout } from 'rxjs';
import { API_CONFIG } from '../tokens/api-config';

const IDEMPOTENT_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const RETRYABLE_STATUS_CODES = new Set([0, 408, 429, 500, 502, 503, 504]);

const isRetryableError = (error: unknown): boolean => {
  if (error instanceof TimeoutError) {
    return true;
  }

  if (error instanceof HttpErrorResponse) {
    return RETRYABLE_STATUS_CODES.has(error.status);
  }

  return false;
};

export const timeoutRetryInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(API_CONFIG);

  return next(req).pipe(
    timeout(config.requestTimeoutMs),
    retry({
      count: IDEMPOTENT_METHODS.has(req.method) ? config.retryCount : 0,
      delay: (error, retryIndex) => {
        if (!isRetryableError(error)) {
          return throwError(() => error);
        }

        return timer(config.retryDelayMs * retryIndex);
      },
    }),
  );
};
