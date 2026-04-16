import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AppErrorHandler } from './app-error-handler';
import { LoggingService } from './logging';
import type { LogContext } from './models/logging-config';

describe('AppErrorHandler', () => {
  let handler: AppErrorHandler;
  let logCalls: Array<{ message: string; context: LogContext }>;

  beforeEach(() => {
    logCalls = [];

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
  });

  it('unwraps ngOriginalError wrappers before logging', () => {
    const originalError = new Error('Inner error');

    handler.handleError({ ngOriginalError: originalError });

    expect(logCalls.length).toBe(1);
    expect(logCalls[0].context).toMatchObject({
      errorMessage: 'Inner error',
    });
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
  });
});
