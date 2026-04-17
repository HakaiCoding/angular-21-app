import { InjectionToken } from '@angular/core';
import {
  DEFAULT_NOTIFICATION_CONFIG,
  type NotificationConfig,
} from '../models/notification-config';

export const NOTIFICATION_CONFIG = new InjectionToken<NotificationConfig>(
  'NOTIFICATION_CONFIG',
  {
    providedIn: 'root',
    factory: () => DEFAULT_NOTIFICATION_CONFIG,
  },
);
