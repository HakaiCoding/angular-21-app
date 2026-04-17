import type { IsActiveMatchOptions } from '@angular/router';
import {
  APP_ROUTE_LINKS,
  type AppRouteLinkKey,
} from './route-contract';

export interface AppNavItem {
  id: AppRouteLinkKey;
  link: (typeof APP_ROUTE_LINKS)[AppRouteLinkKey];
  labelKey: string;
  activeMatchOptions: IsActiveMatchOptions | { exact: boolean };
}

export const APP_NAV_ITEMS: readonly AppNavItem[] = [
  {
    id: 'home',
    link: APP_ROUTE_LINKS.home,
    labelKey: 'shell.nav.home',
    activeMatchOptions: { exact: true },
  },
  {
    id: 'demoPosts',
    link: APP_ROUTE_LINKS.demoPosts,
    labelKey: 'shell.nav.demoPosts',
    activeMatchOptions: { exact: true },
  },
];
