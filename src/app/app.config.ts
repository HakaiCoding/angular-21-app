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
import { environment } from '../environments/environment';
import { APP_AVAILABLE_LANGUAGE_CODES, APP_DEFAULT_LANGUAGE } from './core/i18n/language-options';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    {
      provide: API_CONFIG,
      useValue: environment.api,
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
        availableLangs: APP_AVAILABLE_LANGUAGE_CODES,
        defaultLang: APP_DEFAULT_LANGUAGE.code,
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
