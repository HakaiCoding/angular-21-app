import { ErrorHandler, Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { isApiError } from '../http/models/api-error';
import { NotificationService } from '../notifications/notification';
import type { LogContext } from './models/logging-config';
import { LoggingService } from './logging';

type ObjectLike = Record<string, unknown>;

const isObjectLike = (value: unknown): value is ObjectLike =>
  typeof value === 'object' && value !== null;

const unwrapAngularError = (error: unknown): unknown => {
  let current = error;

  while (isObjectLike(current) && 'ngOriginalError' in current) {
    current = (current as { ngOriginalError: unknown }).ngOriginalError;
  }

  return current;
};

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  private readonly logger = inject(LoggingService);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router, { optional: true });

  handleError(error: unknown): void {
    const normalizedError = unwrapAngularError(error);
    const context = this.buildContext(normalizedError);
    const message = normalizedError instanceof Error
      ? 'Unhandled application error'
      : 'Unhandled non-error throwable';

    this.logger.error(message, context);

    if (!this.shouldNotifyUser(normalizedError)) {
      return;
    }

    this.notifications.error('runtime.unexpected', {
      isMessageKey: true,
      dedupeKey: `runtime:unexpected:${this.router?.url ?? 'no-route'}`,
      context,
    });
  }

  private buildContext(error: unknown): LogContext {
    const baseContext: LogContext = {
      feature: 'runtime',
      area: 'global-error-handler',
      route: this.router?.url ?? null,
    };

    if (error instanceof Error) {
      return {
        ...baseContext,
        errorName: error.name,
        errorMessage: error.message,
        stack: error.stack,
        cause: (error as Error & { cause?: unknown }).cause,
      };
    }

    if (isObjectLike(error)) {
      return {
        ...baseContext,
        throwable: error,
      };
    }

    return {
      ...baseContext,
      throwable: String(error),
    };
  }

  private shouldNotifyUser(error: unknown): boolean {
    if (isApiError(error)) {
      return false;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      return false;
    }

    return true;
  }
}
