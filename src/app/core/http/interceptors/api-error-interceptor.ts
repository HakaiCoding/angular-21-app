import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, TimeoutError } from 'rxjs';
import { ApiError } from '../models/api-error';
import { API_CONFIG } from '../tokens/api-config';
import { isApiRequest } from './is-api-request';

const RETRYABLE_STATUS_CODES = new Set([0, 408, 429, 500, 502, 503, 504]);

const getHttpErrorMessage = (error: HttpErrorResponse): string | undefined => {
  const errorPayload = error.error;
  if (typeof errorPayload === 'string' && errorPayload.trim().length > 0) {
    return errorPayload;
  }

  if (
    typeof errorPayload === 'object' &&
    errorPayload !== null &&
    'message' in errorPayload &&
    typeof (errorPayload as { message: unknown }).message === 'string'
  ) {
    return (errorPayload as { message: string }).message;
  }

  return error.message || undefined;
};

const mapToApiError = (error: unknown, req: HttpRequest<unknown>): ApiError => {
  if (error instanceof TimeoutError) {
    return {
      kind: 'timeout',
      i18nKey: 'errors.timeout',
      retryable: true,
      url: req.urlWithParams,
    };
  }

  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return {
        kind: 'network',
        i18nKey: 'errors.network',
        retryable: true,
        status: error.status,
        url: req.urlWithParams,
      };
    }

    return {
      kind: 'http',
      i18nKey: 'errors.http',
      message: getHttpErrorMessage(error),
      retryable: RETRYABLE_STATUS_CODES.has(error.status),
      status: error.status,
      url: req.urlWithParams,
    };
  }

  return {
    kind: 'unknown',
    i18nKey: 'errors.unknown',
    retryable: false,
    url: req.urlWithParams,
  };
};

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(API_CONFIG);
  if (!isApiRequest(req.url, config.baseUrl)) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: unknown) => throwError(() => mapToApiError(error, req))),
  );
};
