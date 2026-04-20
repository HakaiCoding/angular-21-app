import { Injectable, inject } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ApiClient } from '../../../core/http/api-client';
import { toApiError } from '../../../core/http/models/api-error';
import {
  type PostDto,
} from './models/post.dto';
import type { PostCommentDto } from './models/post-comment.dto';
import type { PostListQueryDto } from './models/post-list-query.dto';
import type { Post } from './models/post.model';
import type { PostComment } from './models/post-comment.model';
import type { PostListQuery } from './models/post-list-query.model';

const mapPostDto = (dto: PostDto): Post => ({
  userId: dto.userId,
  id: dto.id,
  title: dto.title,
  body: dto.body,
});

const mapPostCommentDto = (dto: PostCommentDto): PostComment => ({
  postId: dto.postId,
  id: dto.id,
  name: dto.name,
  email: dto.email,
  body: dto.body,
});

const mapPostList = (dtos: readonly PostDto[]): readonly Post[] => dtos.map(mapPostDto);

const mapPostCommentList = (dtos: readonly PostCommentDto[]): readonly PostComment[] =>
  dtos.map(mapPostCommentDto);

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

@Injectable({
  providedIn: 'root',
})
export class PostsApi {
  private readonly api = inject(ApiClient);

  list(query: PostListQuery = {}): Observable<readonly Post[]> {
    return this.api
      .get<readonly PostDto[], PostListQueryDto>('/posts', {
        params: toPostListQueryDto(query),
      })
      .pipe(
        map(mapPostList),
        catchError((error: unknown) => throwError(() => toApiError(error))),
      );
  }

  getById(postId: number): Observable<Post> {
    return this.api.get<PostDto>(`/posts/${postId}`).pipe(
      map(mapPostDto),
      catchError((error: unknown) => throwError(() => toApiError(error))),
    );
  }

  listComments(postId: number): Observable<readonly PostComment[]> {
    return this.api.get<readonly PostCommentDto[]>(`/posts/${postId}/comments`).pipe(
      map(mapPostCommentList),
      catchError((error: unknown) => throwError(() => toApiError(error))),
    );
  }
}
