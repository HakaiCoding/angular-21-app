import type { NotificationLevel } from './notification';

export type NotificationHorizontalPosition = 'start' | 'center' | 'end' | 'left' | 'right';
export type NotificationVerticalPosition = 'top' | 'bottom';
export type NotificationPoliteness = 'off' | 'polite' | 'assertive';

export interface NotificationConfig {
  durationByLevel: Record<NotificationLevel, number>;
  horizontalPosition: NotificationHorizontalPosition;
  verticalPosition: NotificationVerticalPosition;
  politenessByLevel: Record<NotificationLevel, NotificationPoliteness>;
  panelClassByLevel: Record<NotificationLevel, readonly string[]>;
  persistWithoutActionDurationMs: number;
}

export const DEFAULT_NOTIFICATION_CONFIG: NotificationConfig = {
  durationByLevel: {
    success: 3000,
    info: 3500,
    warn: 5000,
    error: 7000,
  },
  horizontalPosition: 'right',
  verticalPosition: 'top',
  politenessByLevel: {
    success: 'polite',
    info: 'polite',
    warn: 'assertive',
    error: 'assertive',
  },
  panelClassByLevel: {
    success: ['notif', 'notif-success'],
    info: ['notif', 'notif-info'],
    warn: ['notif', 'notif-warn'],
    error: ['notif', 'notif-error'],
  },
  persistWithoutActionDurationMs: 10000,
};
