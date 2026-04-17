import type { ApiConfig } from '../app/core/http/models/api-config';
import type { LoggingConfig } from '../app/core/logging/models/logging-config';
import type { NotificationConfig } from '../app/core/notifications/models/notification-config';

export interface Environment {
  production: boolean;
  api: ApiConfig;
  logging: LoggingConfig;
  notifications: NotificationConfig;
}
