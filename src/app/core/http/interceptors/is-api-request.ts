const FALLBACK_ORIGIN = 'http://localhost';

const normalizePath = (path: string): string => {
  const trimmed = path.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
};

export const isApiRequest = (requestUrl: string, baseUrl: string): boolean => {
  try {
    const appOrigin = typeof location !== 'undefined' ? location.origin : FALLBACK_ORIGIN;
    const request = new URL(requestUrl, appOrigin);
    const base = new URL(baseUrl, appOrigin);

    if (request.origin !== base.origin) {
      return false;
    }

    const requestPath = normalizePath(request.pathname);
    const basePath = normalizePath(base.pathname);

    return requestPath === basePath || requestPath.startsWith(`${basePath}/`);
  } catch {
    return false;
  }
};
