import type { IsActiveMatchOptions } from '@angular/router';
import type { TranslationKey } from '../../../../i18n/types';
import { APP_ROUTE_LINKS } from '../../../../routing/route-contract';

type AppRouteLinkKey = keyof typeof APP_ROUTE_LINKS;
type AppRouteLink = (typeof APP_ROUTE_LINKS)[AppRouteLinkKey];

export interface AppNavItem {
  id: AppRouteLinkKey;
  link: AppRouteLink;
  labelKey: TranslationKey;
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
