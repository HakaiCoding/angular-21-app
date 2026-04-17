import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiClient } from '../../../core/http/api-client';
import type { QueryParams, QueryValue } from '../../../core/http/models/api-request';
import {
  Post,
  PostComment,
  PostCommentDto,
  PostDto,
  PostListQuery,
  toPost,
  toPostComment,
} from './models/post';

const toPostListQueryParams = (query: PostListQuery): QueryParams => {
  const params: Record<string, QueryValue> = {};

  if (query.userId !== undefined) {
    params['userId'] = query.userId;
  }

  if (query.limit !== undefined) {
    params['_limit'] = query.limit;
  }

  return params;
};

@Injectable({
  providedIn: 'root',
})
export class PostsApi {
  private readonly api = inject(ApiClient);

  list(query: PostListQuery = {}): Observable<readonly Post[]> {
    return this.api
      .get<readonly PostDto[]>('/posts', { params: toPostListQueryParams(query) })
      .pipe(map((posts) => posts.map(toPost)));
  }

  getById(postId: number): Observable<Post> {
    return this.api.get<PostDto>(`/posts/${postId}`).pipe(map(toPost));
  }

  listComments(postId: number): Observable<readonly PostComment[]> {
    return this.api
      .get<readonly PostCommentDto[]>(`/posts/${postId}/comments`)
      .pipe(map((comments) => comments.map(toPostComment)));
  }
}
