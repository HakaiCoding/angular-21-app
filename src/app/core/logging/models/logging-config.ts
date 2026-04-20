export const LOG_LEVELS = ['debug', 'info', 'warn', 'error', 'off'] as const;

export type LogLevel = (typeof LOG_LEVELS)[number];

export interface LoggingConfig {
  level: LogLevel;
}

export const DEFAULT_LOGGING_CONFIG: LoggingConfig = {
  level: 'info',
};

export interface LogContext {
  [key: string]: unknown;
}
