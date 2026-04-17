import type { HttpContext, HttpHeaders } from '@angular/common/http';

export type ApiPath = `/${string}`;

export type QueryPrimitive = string | number | boolean;
export type QueryValue =
  | QueryPrimitive
  | readonly QueryPrimitive[]
  | null
  | undefined;

export type QueryParams = Readonly<Record<string, QueryValue>>;

export interface ApiRequestPolicy {
  skipGlobalErrorToast?: boolean;
  skipGlobalErrorLog?: boolean;
}

export interface ApiRequestOptions<TParams extends QueryParams = QueryParams> {
  params?: TParams;
  headers?: HttpHeaders | Record<string, string | string[]>;
  context?: HttpContext;
  policy?: ApiRequestPolicy;
}
