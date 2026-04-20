import type { TranslationKey } from '../../i18n/types';

export const NOTIFICATION_LEVELS = ['success', 'info', 'warn', 'error'] as const;

export type NotificationLevel = (typeof NOTIFICATION_LEVELS)[number];

export type NotificationParams = Readonly<Record<string, unknown>>;

export interface NotificationBaseOptions {
  actionKey?: TranslationKey;
  actionParams?: NotificationParams;
  durationMs?: number;
  persist?: boolean;
  dedupeKey?: string;
  context?: NotificationParams;
}

export interface NotificationTextContent {
  kind: 'text';
  text: string;
}

export interface NotificationKeyContent {
  kind: 'key';
  key: TranslationKey;
  params?: NotificationParams;
  fallbackText?: string;
}

export type NotificationContent = NotificationTextContent | NotificationKeyContent;

export interface NotificationInput extends NotificationBaseOptions {
  level: NotificationLevel;
  content: NotificationContent;
}

export interface NotificationKeyOptions extends NotificationBaseOptions {
  params?: NotificationParams;
  fallbackText?: string;
}
