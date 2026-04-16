import type { ApiConfig } from '../app/core/http/models/api-config';
import type { LoggingConfig } from '../app/core/logging/models/logging-config';

export interface Environment {
  production: boolean;
  api: ApiConfig;
  logging: LoggingConfig;
}
