import type { ApiConfig } from '../../http/models/api-config';
import type { LoggingConfig } from '../../logging/models/logging-config';
import type { NotificationConfig } from '../../notifications/models/notification-config';

export interface RuntimeConfig {
  api: ApiConfig;
  logging: LoggingConfig;
  notifications: NotificationConfig;
}

export interface RuntimeConfigOverride {
  api?: Partial<ApiConfig>;
  logging?: Partial<LoggingConfig>;
  notifications?: {
    durationByLevel?: Partial<NotificationConfig['durationByLevel']>;
    horizontalPosition?: NotificationConfig['horizontalPosition'];
    verticalPosition?: NotificationConfig['verticalPosition'];
    politenessByLevel?: Partial<NotificationConfig['politenessByLevel']>;
    panelClassByLevel?: Partial<NotificationConfig['panelClassByLevel']>;
    persistWithoutActionDurationMs?: number;
  };
}
