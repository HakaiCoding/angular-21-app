import { DEFAULT_API_CONFIG, type ApiConfig } from '../../http/models/api-config';
import { DEFAULT_LOGGING_CONFIG, type LoggingConfig } from '../../logging/models/logging-config';
import {
  DEFAULT_NOTIFICATION_CONFIG,
  type NotificationConfig,
} from '../../notifications/models/notification-config';

export interface RuntimeConfig {
  api: ApiConfig;
  logging: LoggingConfig;
  notifications: NotificationConfig;
}

export const DEFAULT_RUNTIME_CONFIG: RuntimeConfig = {
  api: DEFAULT_API_CONFIG,
  logging: DEFAULT_LOGGING_CONFIG,
  notifications: DEFAULT_NOTIFICATION_CONFIG,
};

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
