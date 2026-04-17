import { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';
import { AppShell } from './core/layout/app-shell/app-shell';
import { APP_ROUTE_LINKS, APP_ROUTE_SEGMENTS } from './core/routing/route-contract';

export const routes: Routes = [
  {
    path: '',
    component: AppShell,
    children: [
      {
        path: APP_ROUTE_SEGMENTS.home,
        loadChildren: () =>
          import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
      },
      {
        path: APP_ROUTE_SEGMENTS.notFound,
        providers: provideTranslocoScope('notFound'),
        loadComponent: () =>
          import('./features/not-found/pages/not-found-page/not-found-page').then(
            (m) => m.NotFoundPage,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: APP_ROUTE_LINKS.notFound,
  },
];
