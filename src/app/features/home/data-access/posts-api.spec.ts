import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PostsApi } from './posts-api';
import { API_CONFIG } from '../../../core/http/tokens/api-config';

describe('PostsApi', () => {
  let service: PostsApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: API_CONFIG,
          useValue: {
            baseUrl: 'https://jsonplaceholder.typicode.com',
            requestTimeoutMs: 5000,
            retryCount: 2,
            retryDelayMs: 300,
            enableAuthHeader: false,
          },
        },
      ],
    });
    service = TestBed.inject(PostsApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
