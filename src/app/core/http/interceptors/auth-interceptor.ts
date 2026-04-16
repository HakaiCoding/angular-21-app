import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_CONFIG } from '../tokens/api-config';
import { AuthToken } from '../../services/auth-token';
import { isApiRequest } from './is-api-request';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = inject(AuthToken);
  const config = inject(API_CONFIG);

  const token = authToken.token();
  if (!config.enableAuthHeader || !token || req.headers.has('Authorization')) {
    return next(req);
  }

  if (!isApiRequest(req.url, config.baseUrl)) {
    return next(req);
  }

  req = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(req);
};
