import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_CONFIG } from '../tokens/api-config';
import { AuthToken } from '../../services/auth-token';
import { isApiRequest } from './is-api-request';
import { LoggingService } from '../../logging/logging.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = inject(AuthToken);
  const config = inject(API_CONFIG);
  const logger = inject(LoggingService);

  const token = authToken.token();
  if (!config.enableAuthHeader || !token || req.headers.has('Authorization')) {
    logger.debug('Authorization header skipped', {
      feature: 'http',
      interceptor: 'authInterceptor',
      url: req.urlWithParams,
      method: req.method,
      reason: !config.enableAuthHeader
        ? 'auth-header-disabled'
        : !token
          ? 'missing-token'
          : 'header-already-present',
    });
    return next(req);
  }

  if (!isApiRequest(req.url, config.baseUrl)) {
    logger.debug('Authorization header skipped for non-api request', {
      feature: 'http',
      interceptor: 'authInterceptor',
      url: req.urlWithParams,
      method: req.method,
    });
    return next(req);
  }

  req = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  logger.debug('Authorization header attached', {
    feature: 'http',
    interceptor: 'authInterceptor',
    url: req.urlWithParams,
    method: req.method,
  });

  return next(req);
};
