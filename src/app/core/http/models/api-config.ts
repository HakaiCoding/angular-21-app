export interface ApiConfig {
  baseUrl: string;
  requestTimeoutMs: number;
  retryCount: number;
  retryDelayMs: number;
  enableAuthHeader: boolean;
}

export const DEFAULT_API_CONFIG: ApiConfig = {
  baseUrl: 'https://jsonplaceholder.typicode.com',
  requestTimeoutMs: 10000,
  retryCount: 1,
  retryDelayMs: 300,
  enableAuthHeader: false,
};
