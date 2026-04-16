import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslocoHttpLoader } from './core/i18n/transloco-http.loader';
import { provideTransloco } from '@jsverse/transloco';
import { API_CONFIG } from './core/http/tokens/api-config';
import { authInterceptor } from './core/http/interceptors/auth-interceptor';
import { apiErrorInterceptor } from './core/http/interceptors/api-error-interceptor';
import { timeoutRetryInterceptor } from './core/http/interceptors/timeout-retry-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    {
      provide: API_CONFIG,
      useValue: {
        baseUrl: 'https://jsonplaceholder.typicode.com',
        requestTimeoutMs: 5000,
        retryCount: 2,
        retryDelayMs: 300,
        enableAuthHeader: false,
      },
    },
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        apiErrorInterceptor,
        timeoutRetryInterceptor,
      ]),
    ),
    provideTransloco({
      config: {
        availableLangs: ['en', 'fr', 'de', 'es', 'it'],
        defaultLang: 'en',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
