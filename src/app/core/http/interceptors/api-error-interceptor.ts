import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, TimeoutError } from 'rxjs';
import { ApiError } from '../models/api-error';
import { API_CONFIG } from '../tokens/api-config';

const RETRYABLE_STATUS_CODES = new Set([0, 408, 429, 500, 502, 503, 504]);

const mapToApiError = (error: unknown, req: HttpRequest<unknown>): ApiError => {
  if (error instanceof TimeoutError) {
    return {
      kind: 'timeout',
      message: 'The request timed out.',
      retryable: true,
      url: req.urlWithParams,
    };
  }

  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return {
        kind: 'network',
        message: 'Network error. Please check your connection.',
        retryable: true,
        status: error.status,
        url: req.urlWithParams,
      };
    }

    return {
      kind: 'http',
      message: error.message || 'Request failed.',
      retryable: RETRYABLE_STATUS_CODES.has(error.status),
      status: error.status,
      url: req.urlWithParams,
    };
  }

  return {
    kind: 'unknown',
    message: 'Unexpected error while calling the API.',
    retryable: false,
    url: req.urlWithParams,
  };
};

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(API_CONFIG);
  if (!req.url.startsWith(config.baseUrl)) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: unknown) => throwError(() => mapToApiError(error, req))),
  );
};
