import { DEFAULT_RUNTIME_CONFIG } from '../app/core/config/models/runtime-config';
import type { Environment } from './environment.model';

export const environment: Environment = {
  ...DEFAULT_RUNTIME_CONFIG,
  production: false,
  logging: {
    ...DEFAULT_RUNTIME_CONFIG.logging,
    level: 'debug',
  },
};
