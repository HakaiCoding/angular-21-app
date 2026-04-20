export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'off';

export interface LoggingConfig {
  level: LogLevel;
}

export const DEFAULT_LOGGING_CONFIG: LoggingConfig = {
  level: 'info',
};

export interface LogContext {
  [key: string]: unknown;
}
