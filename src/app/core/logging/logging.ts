import { Injectable, inject, signal } from '@angular/core';
import type { LogEntry } from './models/log-entry';
import type { LogContext, LogLevel } from './models/logging-config';
import { LOGGING_CONFIG } from './tokens/logging-config';

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  off: 99,
};

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  private readonly config = inject(LOGGING_CONFIG);
  private readonly level = signal<LogLevel>(this.config.level);

  readonly activeLevel = this.level.asReadonly();

  setLevel(level: LogLevel): void {
    this.level.set(level);
  }

  debug(message: string, context: LogContext = {}): void {
    this.write('debug', message, context);
  }

  info(message: string, context: LogContext = {}): void {
    this.write('info', message, context);
  }

  warn(message: string, context: LogContext = {}): void {
    this.write('warn', message, context);
  }

  error(message: string, context: LogContext = {}): void {
    this.write('error', message, context);
  }

  private write(level: Exclude<LogLevel, 'off'>, message: string, context: LogContext): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
    };

    switch (entry.level) {
      case 'debug':
        console.debug(entry);
        break;
      case 'info':
        console.info(entry);
        break;
      case 'warn':
        console.warn(entry);
        break;
      case 'error':
        console.error(entry);
        break;
    }
  }

  private shouldLog(level: Exclude<LogLevel, 'off'>): boolean {
    const currentLevel = this.level();
    return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[currentLevel];
  }
}
