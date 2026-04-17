import { EnvironmentProviders, importProvidersFrom, makeEnvironmentProviders } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import type { NotificationConfig } from './models/notification-config';
import { NOTIFICATION_CONFIG } from './tokens/notification-config';

export const provideNotifications = (config?: NotificationConfig): EnvironmentProviders =>
  makeEnvironmentProviders([
    importProvidersFrom(MatSnackBarModule),
    ...(config ? [{ provide: NOTIFICATION_CONFIG, useValue: config }] : []),
  ]);
