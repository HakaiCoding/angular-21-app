import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AppErrorHandler } from './app-error-handler';
import { LoggingService } from './logging';
import type { LogContext } from './models/logging-config';
import { NotificationService } from '../notifications/notification';

describe('AppErrorHandler', () => {
  let handler: AppErrorHandler;
  let logCalls: Array<{ message: string; context: LogContext }>;
  let notificationCalls: Array<{
    message: string;
    options: (Record<string, unknown> & { context?: LogContext }) | undefined;
  }>;

  beforeEach(() => {
    logCalls = [];
    notificationCalls = [];

    TestBed.configureTestingModule({
      providers: [
        AppErrorHandler,
        {
          provide: LoggingService,
          useValue: {
            error: (message: string, context: LogContext) => {
              logCalls.push({ message, context });
            },
          },
        },
        {
          provide: NotificationService,
          useValue: {
            error: (message: string, options?: Record<string, unknown> & { context?: LogContext }) => {
              notificationCalls.push({ message, options });
            },
          },
        },
        {
          provide: Router,
          useValue: { url: '/home' },
        },
      ],
    });

    handler = TestBed.inject(AppErrorHandler);
  });

  it('logs unhandled Error instances with structured context', () => {
    const error = new Error('Unexpected failure');

    handler.handleError(error);

    expect(logCalls.length).toBe(1);
    expect(logCalls[0].message).toBe('Unhandled application error');
    expect(logCalls[0].context).toMatchObject({
      feature: 'runtime',
      area: 'global-error-handler',
      route: '/home',
      errorName: 'Error',
      errorMessage: 'Unexpected failure',
    });
    expect(notificationCalls.length).toBe(1);
    expect(notificationCalls[0].message).toBe('errors.unknown');
    expect(notificationCalls[0].options?.context).toMatchObject({
      feature: 'runtime',
      area: 'global-error-handler',
    });
  });

  it('unwraps ngOriginalError wrappers before logging', () => {
    const originalError = new Error('Inner error');

    handler.handleError({ ngOriginalError: originalError });

    expect(logCalls.length).toBe(1);
    expect(logCalls[0].context).toMatchObject({
      errorMessage: 'Inner error',
    });
    expect(notificationCalls.length).toBe(1);
  });

  it('logs non-Error throwables safely', () => {
    handler.handleError('failure');

    expect(logCalls.length).toBe(1);
    expect(logCalls[0].message).toBe('Unhandled non-error throwable');
    expect(logCalls[0].context).toMatchObject({
      feature: 'runtime',
      area: 'global-error-handler',
      route: '/home',
      throwable: 'failure',
    });
    expect(notificationCalls.length).toBe(1);
  });

  it('does not notify users for ApiError instances', () => {
    handler.handleError({
      kind: 'network',
      i18nKey: 'errors.network',
      retryable: true,
    });

    expect(logCalls.length).toBe(1);
    expect(notificationCalls.length).toBe(0);
  });

  it('does not notify users for AbortError', () => {
    const abortError = new Error('Request aborted');
    abortError.name = 'AbortError';

    handler.handleError(abortError);

    expect(logCalls.length).toBe(1);
    expect(notificationCalls.length).toBe(0);
  });
});
