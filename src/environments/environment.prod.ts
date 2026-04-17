import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  api: {
    baseUrl: 'https://jsonplaceholder.typicode.com',
    requestTimeoutMs: 5000,
    retryCount: 2,
    retryDelayMs: 300,
    enableAuthHeader: false,
  },
  logging: {
    level: 'warn',
  },
  notifications: {
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
  },
};
