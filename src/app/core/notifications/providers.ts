import { EnvironmentProviders, importProvidersFrom, makeEnvironmentProviders } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

export const provideNotifications = (): EnvironmentProviders =>
  makeEnvironmentProviders([importProvidersFrom(MatSnackBarModule)]);
