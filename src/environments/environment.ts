import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  api: {
    baseUrl: 'https://jsonplaceholder.typicode.com',
    requestTimeoutMs: 5000,
    retryCount: 2,
    retryDelayMs: 300,
    enableAuthHeader: false,
  },
  logging: {
    level: 'debug',
  },
};
