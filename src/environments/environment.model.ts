import type { RuntimeConfig } from '../app/core/config/models/runtime-config';

export interface Environment extends RuntimeConfig {
  production: boolean;
}
