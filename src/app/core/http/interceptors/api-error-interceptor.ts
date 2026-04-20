import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, TimeoutError } from 'rxjs';
import type { ApiError } from '../models/api-error';
import { API_CONFIG } from '../tokens/api-config';
import { isApiRequest } from './is-api-request';
import { LoggingService } from '../../logging/logging.service';
import { NotificationService } from '../../notifications/notification.service';
import type { TranslationKey } from '../../i18n/types';
import { SKIP_GLOBAL_ERROR_LOG, SKIP_GLOBAL_ERROR_TOAST } from '../tokens/request-policy';

const RETRYABLE_STATUS_CODES = new Set([0, 408, 429, 500, 502, 503, 504]);
const API_ERROR_MESSAGE_KEYS: Record<ApiError['kind'], TranslationKey> = {
  timeout: 'errors.timeout',
  network: 'errors.network',
  http: 'errors.http',
  unknown: 'errors.unknown',
};

const toApiErrorMessageKey = (error: ApiError): TranslationKey =>
  API_ERROR_MESSAGE_KEYS[error.kind];

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
      retryable: true,
      url: req.urlWithParams,
    };
  }

  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return {
        kind: 'network',
        retryable: true,
        status: error.status,
        url: req.urlWithParams,
      };
    }

    return {
      kind: 'http',
      message: getHttpErrorMessage(error),
      retryable: RETRYABLE_STATUS_CODES.has(error.status),
      status: error.status,
      url: req.urlWithParams,
    };
  }

  return {
    kind: 'unknown',
    retryable: false,
    url: req.urlWithParams,
  };
};

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(API_CONFIG);
  const logger = inject(LoggingService);
  const notifications = inject(NotificationService);

  if (!isApiRequest(req.url, config.baseUrl)) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: unknown) => {
      const apiError = mapToApiError(error, req);
      const messageKey = toApiErrorMessageKey(apiError);
      const errorStatus = apiError.kind === 'http' || apiError.kind === 'network'
        ? apiError.status
        : undefined;
      const context = {
        feature: 'http',
        interceptor: 'apiErrorInterceptor',
        method: req.method,
        url: req.urlWithParams,
        kind: apiError.kind,
        messageKey,
        retryable: apiError.retryable,
        status: errorStatus,
      };

      if (!req.context.get(SKIP_GLOBAL_ERROR_LOG)) {
        if (apiError.retryable) {
          logger.warn('API request failed with retryable error', context);
        } else {
          logger.error('API request failed with non-retryable error', context);
        }
      }

      if (req.context.get(SKIP_GLOBAL_ERROR_TOAST)) {
        return throwError(() => apiError);
      }

      const dedupeKey = `api:${apiError.kind}:${errorStatus ?? 'none'}:${req.method}:${req.url}`;
      if (apiError.kind === 'http' && apiError.message) {
        notifications.show({
          level: apiError.retryable ? 'warn' : 'error',
          content: {
            kind: 'key',
            key: messageKey,
            fallbackText: apiError.message,
          },
          dedupeKey,
          context,
        });
      } else if (apiError.retryable) {
        notifications.warnKey(messageKey, {
          dedupeKey,
          context,
        });
      } else {
        notifications.errorKey(messageKey, {
          dedupeKey,
          context,
        });
      }

      return throwError(() => apiError);
    }),
  );
};
