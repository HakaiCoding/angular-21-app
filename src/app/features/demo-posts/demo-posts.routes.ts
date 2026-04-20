import type { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';

export const DEMO_POSTS_ROUTES: Routes = [
  {
    path: '',
    providers: provideTranslocoScope('demoPosts'),
    loadComponent: () =>
      import('./pages/demo-posts-page/demo-posts-page').then(
        (m) => m.DemoPostsPage,
      ),
  },
];
