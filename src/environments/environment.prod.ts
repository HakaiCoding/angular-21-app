import { Environment } from './environment.model';
import { DEFAULT_API_CONFIG, DEFAULT_NOTIFICATION_CONFIG } from './environment.defaults';

export const environment: Environment = {
  production: true,
  api: DEFAULT_API_CONFIG,
  logging: {
    level: 'warn',
  },
  notifications: DEFAULT_NOTIFICATION_CONFIG,
};
