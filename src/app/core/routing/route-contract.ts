export const APP_ROUTE_SEGMENTS = {
  home: '',
  demoPosts: 'demo-posts',
  notFound: 'not-found',
} as const;

type AppRouteSegments = typeof APP_ROUTE_SEGMENTS;
type RouteLink<TSegment extends string> = TSegment extends '' ? '/' : `/${TSegment}`;

const toRouteLink = <TSegment extends string>(segment: TSegment): RouteLink<TSegment> =>
  (segment === '' ? '/' : `/${segment}`) as RouteLink<TSegment>;

export const APP_ROUTE_LINKS: { [K in keyof AppRouteSegments]: RouteLink<AppRouteSegments[K]> } = {
  home: toRouteLink(APP_ROUTE_SEGMENTS.home),
  demoPosts: toRouteLink(APP_ROUTE_SEGMENTS.demoPosts),
  notFound: toRouteLink(APP_ROUTE_SEGMENTS.notFound),
};
