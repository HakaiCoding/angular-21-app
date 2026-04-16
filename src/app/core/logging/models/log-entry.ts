import type { LogContext, LogLevel } from './logging-config';

export interface LogEntry {
  level: Exclude<LogLevel, 'off'>;
  message: string;
  context: LogContext;
  timestamp: string;
}
