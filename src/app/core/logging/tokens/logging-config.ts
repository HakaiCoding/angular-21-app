import { InjectionToken } from '@angular/core';
import type { LoggingConfig } from '../models/logging-config';

export const DEFAULT_LOGGING_CONFIG: LoggingConfig = {
  level: 'info',
};

export const LOGGING_CONFIG = new InjectionToken<LoggingConfig>('LOGGING_CONFIG', {
  providedIn: 'root',
  factory: () => DEFAULT_LOGGING_CONFIG,
});
