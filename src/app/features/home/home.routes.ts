import { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    providers: provideTranslocoScope('home'),
    loadComponent: () =>
      import('./pages/home-page/home-page').then((m) => m.HomePage),
  },
];
