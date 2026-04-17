import {
  ApplicationConfig,
  ErrorHandler,
  inject,
  isDevMode,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
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
import { LOGGING_CONFIG } from './core/logging/tokens/logging-config';
import { AppErrorHandler } from './core/logging/app-error-handler';
import { provideNotifications } from './core/notifications/providers';
import { LanguagePersistenceService } from './core/i18n/language-persistence';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    {
      provide: API_CONFIG,
      useValue: environment.api,
    },
    {
      provide: LOGGING_CONFIG,
      useValue: environment.logging,
    },
    {
      provide: ErrorHandler,
      useClass: AppErrorHandler,
    },
    provideNotifications(environment.notifications),
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
    provideAppInitializer(() => {
      inject(LanguagePersistenceService).initialize();
    }),
  ],
};
