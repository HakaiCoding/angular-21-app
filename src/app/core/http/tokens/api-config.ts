import { InjectionToken } from '@angular/core';
import type { ApiConfig } from '../models/api-config';

export const API_CONFIG = new InjectionToken<ApiConfig>('API_CONFIG');
