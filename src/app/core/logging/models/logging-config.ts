export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'off';

export interface LoggingConfig {
  level: LogLevel;
}

export interface LogContext {
  [key: string]: unknown;
}
