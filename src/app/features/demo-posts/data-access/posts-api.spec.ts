import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ApiClient } from '../../../core/http/api-client';
import type { Post } from './models/post.model';
import type { PostComment } from './models/post-comment.model';
import { PostsApi } from './posts-api';

describe('PostsApi', () => {
  let service: PostsApi;
  let apiClient: { get: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    apiClient = {
      get: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        PostsApi,
        {
          provide: ApiClient,
          useValue: apiClient,
        },
      ],
    });

    service = TestBed.inject(PostsApi);
  });

  it('loads posts with query params', () => {
    apiClient.get.mockReturnValue(
      of([
        {
          userId: 7,
          id: 1,
          title: 'Hello',
          body: 'World',
        },
      ]),
    );

    let result: readonly Post[] = [];
    service.list({ userId: 7, limit: 5 }).subscribe((posts) => {
      result = posts;
    });

    expect(apiClient.get).toHaveBeenCalledWith('/posts', {
      params: {
        userId: 7,
        _limit: 5,
      },
    });
    expect(result).toEqual([
      {
        userId: 7,
        id: 1,
        title: 'Hello',
        body: 'World',
      },
    ]);
  });

  it('loads a single post by id', () => {
    apiClient.get.mockReturnValue(
      of({
        userId: 3,
        id: 10,
        title: 'Post',
        body: 'Body',
      }),
    );

    let result: Post | null = null;
    service.getById(10).subscribe((post) => {
      result = post;
    });

    expect(apiClient.get).toHaveBeenCalledWith('/posts/10');
    expect(result).toEqual({
      userId: 3,
      id: 10,
      title: 'Post',
      body: 'Body',
    });
  });

  it('loads post comments', () => {
    apiClient.get.mockReturnValue(
      of([
        {
          postId: 10,
          id: 1,
          name: 'Alice',
          email: 'alice@example.com',
          body: 'Comment body',
        },
      ]),
    );

    let result: readonly PostComment[] = [];
    service.listComments(10).subscribe((comments) => {
      result = comments;
    });

    expect(apiClient.get).toHaveBeenCalledWith('/posts/10/comments');
    expect(result).toEqual([
      {
        postId: 10,
        id: 1,
        name: 'Alice',
        email: 'alice@example.com',
        body: 'Comment body',
      },
    ]);
  });
});
