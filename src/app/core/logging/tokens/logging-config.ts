import { InjectionToken } from '@angular/core';
import { DEFAULT_LOGGING_CONFIG, type LoggingConfig } from '../models/logging-config';

export const LOGGING_CONFIG = new InjectionToken<LoggingConfig>('LOGGING_CONFIG', {
  providedIn: 'root',
  factory: () => DEFAULT_LOGGING_CONFIG,
});
