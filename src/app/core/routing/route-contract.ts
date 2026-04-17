export const APP_ROUTE_SEGMENTS = {
  home: '',
  notFound: 'not-found',
} as const;

export const APP_ROUTE_LINKS = {
  home: '/',
  notFound: '/not-found',
} as const;

export type AppRouteSegmentKey = keyof typeof APP_ROUTE_SEGMENTS;
export type AppRouteLinkKey = keyof typeof APP_ROUTE_LINKS;
