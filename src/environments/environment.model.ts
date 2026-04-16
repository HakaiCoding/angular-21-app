import type { ApiConfig } from '../app/core/http/models/api-config';

export interface Environment {
  production: boolean;
  api: ApiConfig;
}
