import { Injectable, inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiClient } from '../../../core/http/api-client';
import { toApiError } from '../../../core/http/models/api-error';
import type { QueryParams, QueryValue } from '../../../core/http/models/api-request';
import type { PostListQueryDto } from './models/post-list-query.dto';
import type { Post } from './models/post.model';
import type { PostComment } from './models/post-comment.model';
import type { PostListQuery } from './models/post-list-query.model';

const toPostListQueryDto = (query: PostListQuery): PostListQueryDto => {
  const dto: PostListQueryDto = {};
  if (query.userId !== undefined) {
    dto.userId = query.userId;
  }
  if (query.limit !== undefined) {
    dto._limit = query.limit;
  }
  return dto;
};

const toQueryParams = (dto: PostListQueryDto): QueryParams => {
  const queryParams: Record<string, QueryValue> = {};
  for (const [key, value] of Object.entries(dto)) {
    queryParams[key] = value;
  }
  return queryParams;
};

@Injectable({
  providedIn: 'root',
})
export class PostsApi {
  private readonly api = inject(ApiClient);

  list(query: PostListQuery = {}): Observable<readonly Post[]> {
    return this.api
      .get<readonly Post[]>('/posts', {
        params: toQueryParams(toPostListQueryDto(query)),
      })
      .pipe(
        catchError((error: unknown) => throwError(() => toApiError(error))),
      );
  }

  getById(postId: number): Observable<Post> {
    return this.api.get<Post>(`/posts/${postId}`).pipe(
      catchError((error: unknown) => throwError(() => toApiError(error))),
    );
  }

  listComments(postId: number): Observable<readonly PostComment[]> {
    return this.api.get<readonly PostComment[]>(`/posts/${postId}/comments`).pipe(
      catchError((error: unknown) => throwError(() => toApiError(error))),
    );
  }
}
