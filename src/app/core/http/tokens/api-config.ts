import { InjectionToken } from '@angular/core';

export interface ApiConfig {
  baseUrl: string;
  requestTimeoutMs: number;
  retryCount: number;
  retryDelayMs: number;
  enableAuthHeader: boolean;
}

export const API_CONFIG = new InjectionToken<ApiConfig>('API_CONFIG');
