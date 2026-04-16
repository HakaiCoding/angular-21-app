import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { retry, throwError, timer, TimeoutError, timeout } from 'rxjs';
import { API_CONFIG } from '../tokens/api-config';
import { isApiRequest } from './is-api-request';
import { LoggingService } from '../../logging/logging';

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

const getRetryErrorContext = (error: unknown): Record<string, unknown> => {
  if (error instanceof TimeoutError) {
    return { kind: 'timeout' };
  }

  if (error instanceof HttpErrorResponse) {
    return {
      kind: 'http',
      status: error.status,
      message: error.message,
    };
  }

  return {
    kind: 'unknown',
  };
};

export const timeoutRetryInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(API_CONFIG);
  const logger = inject(LoggingService);

  if (!isApiRequest(req.url, config.baseUrl)) {
    return next(req);
  }

  logger.debug('Applying timeout/retry policy', {
    feature: 'http',
    interceptor: 'timeoutRetryInterceptor',
    url: req.urlWithParams,
    method: req.method,
    timeoutMs: config.requestTimeoutMs,
    retryCount: IDEMPOTENT_METHODS.has(req.method) ? config.retryCount : 0,
  });

  return next(req).pipe(
    timeout(config.requestTimeoutMs),
    retry({
      count: IDEMPOTENT_METHODS.has(req.method) ? config.retryCount : 0,
      delay: (error, retryIndex) => {
        if (!isRetryableError(error)) {
          return throwError(() => error);
        }

        logger.warn('Retrying API request', {
          feature: 'http',
          interceptor: 'timeoutRetryInterceptor',
          url: req.urlWithParams,
          method: req.method,
          retryIndex,
          maxRetryCount: config.retryCount,
          retryDelayMs: config.retryDelayMs * retryIndex,
          ...getRetryErrorContext(error),
        });

        return timer(config.retryDelayMs * retryIndex);
      },
    }),
  );
};
