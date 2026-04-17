export type NotificationLevel = 'success' | 'info' | 'warn' | 'error';

export interface NotificationInput {
  level: NotificationLevel;
  messageKey?: string;
  params?: Record<string, unknown>;
  message?: string;
  actionKey?: string;
  actionParams?: Record<string, unknown>;
  durationMs?: number;
  persist?: boolean;
  dedupeKey?: string;
  context?: Record<string, unknown>;
}

export interface NotificationOptions {
  params?: Record<string, unknown>;
  actionKey?: string;
  actionParams?: Record<string, unknown>;
  durationMs?: number;
  persist?: boolean;
  dedupeKey?: string;
  context?: Record<string, unknown>;
}
