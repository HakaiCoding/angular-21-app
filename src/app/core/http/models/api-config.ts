export interface ApiConfig {
  baseUrl: string;
  requestTimeoutMs: number;
  retryCount: number;
  retryDelayMs: number;
  enableAuthHeader: boolean;
}
