import {
  HttpClient,
  HttpContext,
  HttpParams,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type {
  ApiPath,
  ApiRequestOptions,
  QueryParams,
  QueryPrimitive,
  QueryValue,
} from './models/api-request';
import { API_CONFIG } from './tokens/api-config';
import {
  SKIP_GLOBAL_ERROR_LOG,
  SKIP_GLOBAL_ERROR_TOAST,
} from './tokens/request-policy';

const trimTrailingSlash = (value: string): string => value.replace(/\/+$/, '');

const isQueryArray = (
  value: QueryValue,
): value is readonly QueryPrimitive[] => Array.isArray(value);

const setParamValues = (
  params: HttpParams,
  key: string,
  value: QueryValue,
): HttpParams => {
  if (value === null || value === undefined) {
    return params;
  }

  let values: readonly QueryPrimitive[];
  if (isQueryArray(value)) {
    values = value;
  } else {
    values = [value as QueryPrimitive];
  }

  if (values.length === 0) {
    return params;
  }

  const serialized = values.map((entry) => String(entry));
  return serialized.reduce<HttpParams>(
    (nextParams, serializedValue, index) =>
      index === 0
        ? nextParams.set(key, serializedValue)
        : nextParams.append(key, serializedValue),
    params,
  );
};

const toHttpParams = (queryParams: QueryParams | undefined): HttpParams => {
  if (!queryParams) {
    return new HttpParams();
  }

  return Object.entries(queryParams).reduce<HttpParams>(
    (params, [key, value]) => setParamValues(params, key, value),
    new HttpParams(),
  );
};

@Injectable({
  providedIn: 'root',
})
export class ApiClient {
  private readonly http = inject(HttpClient);
  private readonly config = inject(API_CONFIG);

  get<TResponse, TParams extends QueryParams = QueryParams>(
    path: ApiPath,
    options: ApiRequestOptions<TParams> = {},
  ): Observable<TResponse> {
    return this.http.get<TResponse>(this.toUrl(path), {
      params: toHttpParams(options.params),
      headers: options.headers,
      context: this.toContext(options.context, options.policy),
    });
  }

  private toUrl(path: ApiPath): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${trimTrailingSlash(this.config.baseUrl)}${normalizedPath}`;
  }

  private toContext(
    baseContext: HttpContext | undefined,
    policy: ApiRequestOptions['policy'],
  ): HttpContext {
    let context = baseContext ?? new HttpContext();

    if (policy?.skipGlobalErrorToast) {
      context = context.set(SKIP_GLOBAL_ERROR_TOAST, true);
    }

    if (policy?.skipGlobalErrorLog) {
      context = context.set(SKIP_GLOBAL_ERROR_LOG, true);
    }

    return context;
  }
}
