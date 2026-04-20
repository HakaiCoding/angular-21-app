import type { NotificationLevel } from './notification';

export const NOTIFICATION_HORIZONTAL_POSITIONS = ['start', 'center', 'end', 'left', 'right'] as const;
export type NotificationHorizontalPosition = (typeof NOTIFICATION_HORIZONTAL_POSITIONS)[number];

export const NOTIFICATION_VERTICAL_POSITIONS = ['top', 'bottom'] as const;
export type NotificationVerticalPosition = (typeof NOTIFICATION_VERTICAL_POSITIONS)[number];

export const NOTIFICATION_POLITENESS_VALUES = ['off', 'polite', 'assertive'] as const;
export type NotificationPoliteness = (typeof NOTIFICATION_POLITENESS_VALUES)[number];

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
