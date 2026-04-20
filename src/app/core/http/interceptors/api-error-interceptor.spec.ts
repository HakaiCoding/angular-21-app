import { HttpClient, HttpContext, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LoggingService } from '../../logging/logging';
import { NotificationService } from '../../notifications/notification';
import { API_CONFIG } from '../tokens/api-config';
import { SKIP_GLOBAL_ERROR_LOG, SKIP_GLOBAL_ERROR_TOAST } from '../tokens/request-policy';
import { apiErrorInterceptor } from './api-error-interceptor';

describe('apiErrorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let logger: {
    warn: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
  };
  let notifications: {
    show: ReturnType<typeof vi.fn>;
    warnKey: ReturnType<typeof vi.fn>;
    errorKey: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    logger = {
      warn: vi.fn(),
      error: vi.fn(),
    };
    notifications = {
      show: vi.fn(),
      warnKey: vi.fn(),
      errorKey: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
        provideHttpClientTesting(),
        {
          provide: API_CONFIG,
          useValue: {
            baseUrl: 'https://api.example.com',
            requestTimeoutMs: 5000,
            retryCount: 2,
            retryDelayMs: 300,
            enableAuthHeader: false,
          },
        },
        {
          provide: LoggingService,
          useValue: logger,
        },
        {
          provide: NotificationService,
          useValue: notifications,
        },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('logs and shows global notification by default', () => {
    let thrownError: unknown;

    http.get('https://api.example.com/users').subscribe({
      next: () => undefined,
      error: (error) => {
        thrownError = error;
      },
    });

    const request = httpMock.expectOne('https://api.example.com/users');
    request.flush({ message: 'Server is unavailable' }, { status: 500, statusText: 'Server Error' });

    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.error).not.toHaveBeenCalled();
    expect(notifications.show).toHaveBeenCalledTimes(1);
    expect(thrownError).toMatchObject({
      kind: 'http',
      retryable: true,
      status: 500,
    });
  });

  it('supports request-level opt-out for global notification toasts', () => {
    http.get('https://api.example.com/users', {
      context: new HttpContext().set(SKIP_GLOBAL_ERROR_TOAST, true),
    }).subscribe({
      next: () => undefined,
      error: () => undefined,
    });

    const request = httpMock.expectOne('https://api.example.com/users');
    request.flush({ message: 'Server is unavailable' }, { status: 500, statusText: 'Server Error' });

    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(notifications.show).not.toHaveBeenCalled();
    expect(notifications.warnKey).not.toHaveBeenCalled();
    expect(notifications.errorKey).not.toHaveBeenCalled();
  });

  it('supports request-level opt-out for global error logging', () => {
    http.get('https://api.example.com/users', {
      context: new HttpContext().set(SKIP_GLOBAL_ERROR_LOG, true),
    }).subscribe({
      next: () => undefined,
      error: () => undefined,
    });

    const request = httpMock.expectOne('https://api.example.com/users');
    request.flush({ message: 'Server is unavailable' }, { status: 500, statusText: 'Server Error' });

    expect(logger.warn).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
    expect(notifications.show).toHaveBeenCalledTimes(1);
  });
});
