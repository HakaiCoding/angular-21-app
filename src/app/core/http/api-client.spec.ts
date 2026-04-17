import {
  HttpContext,
  HttpContextToken,
  provideHttpClient,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiClient } from './api-client';
import { API_CONFIG } from './tokens/api-config';
import {
  SKIP_GLOBAL_ERROR_LOG,
  SKIP_GLOBAL_ERROR_TOAST,
} from './tokens/request-policy';

describe('ApiClient', () => {
  let service: ApiClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiClient,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: API_CONFIG,
          useValue: {
            baseUrl: 'https://api.example.com/',
            requestTimeoutMs: 5000,
            retryCount: 2,
            retryDelayMs: 300,
            enableAuthHeader: false,
          },
        },
      ],
    });

    service = TestBed.inject(ApiClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('prefixes the configured base url and serializes query params', () => {
    service.get<readonly unknown[]>('/posts', {
      params: {
        userId: 1,
        tags: ['angular', 'signals'],
      },
    }).subscribe();

    const request = httpMock.expectOne(
      (pendingRequest) => pendingRequest.url === 'https://api.example.com/posts',
    );
    expect(request.request.params.get('userId')).toBe('1');
    expect(request.request.params.getAll('tags')).toEqual([
      'angular',
      'signals',
    ]);
    request.flush([]);
  });

  it('applies request-level policy to HttpContext tokens', () => {
    service.get<readonly unknown[]>('/posts', {
      policy: {
        skipGlobalErrorToast: true,
        skipGlobalErrorLog: true,
      },
    }).subscribe();

    const request = httpMock.expectOne('https://api.example.com/posts');
    expect(request.request.context.get(SKIP_GLOBAL_ERROR_TOAST)).toBe(true);
    expect(request.request.context.get(SKIP_GLOBAL_ERROR_LOG)).toBe(true);
    request.flush([]);
  });

  it('preserves custom HttpContext values while applying policy', () => {
    const CUSTOM_CONTEXT_TOKEN = new HttpContextToken<boolean>(() => false);
    const context = new HttpContext().set(CUSTOM_CONTEXT_TOKEN, true);

    service.get<readonly unknown[]>('/posts', {
      context,
      policy: {
        skipGlobalErrorToast: true,
      },
    }).subscribe();

    const request = httpMock.expectOne('https://api.example.com/posts');
    expect(request.request.context.get(CUSTOM_CONTEXT_TOKEN)).toBe(true);
    expect(request.request.context.get(SKIP_GLOBAL_ERROR_TOAST)).toBe(true);
    request.flush([]);
  });
});
