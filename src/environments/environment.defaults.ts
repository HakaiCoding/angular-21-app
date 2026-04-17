import type { ApiConfig } from '../app/core/http/models/api-config';
import type { NotificationConfig } from '../app/core/notifications/models/notification-config';

export const DEFAULT_API_CONFIG: ApiConfig = {
  baseUrl: 'https://jsonplaceholder.typicode.com',
  requestTimeoutMs: 10000,
  retryCount: 1,
  retryDelayMs: 300,
  enableAuthHeader: false,
};

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
