import { InjectionToken } from '@angular/core';
import type { RuntimeConfig } from '../models/runtime-config';

export const RUNTIME_CONFIG_DEFAULT = new InjectionToken<RuntimeConfig>(
  'RUNTIME_CONFIG_DEFAULT',
);

export const RUNTIME_CONFIG_URL = new InjectionToken<string>('RUNTIME_CONFIG_URL', {
  providedIn: 'root',
  factory: () => '/assets/app-config.json',
});
