import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PostsApi } from './posts-api';
import { PostsStore } from './posts-store';

describe('PostsStore', () => {
  let service: PostsStore;
  let postsApi: {
    list: ReturnType<typeof vi.fn>;
    getById: ReturnType<typeof vi.fn>;
    listComments: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    postsApi = {
      list: vi.fn(),
      getById: vi.fn(),
      listComments: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        PostsStore,
        {
          provide: PostsApi,
          useValue: postsApi,
        },
      ],
    });

    service = TestBed.inject(PostsStore);
  });

  it('loads posts into a success state', () => {
    postsApi.list.mockReturnValue(
      of([
        { userId: 1, id: 1, title: 'A', body: 'B' },
      ]),
    );

    service.loadPostList();

    expect(service.listState()).toEqual({
      status: 'success',
      data: [{ userId: 1, id: 1, title: 'A', body: 'B' }],
    });
    expect(service.posts()).toEqual([
      { userId: 1, id: 1, title: 'A', body: 'B' },
    ]);
    expect(service.isListLoading()).toBe(false);
    expect(service.hasListError()).toBe(false);
  });

  it('stores failure state when load fails', () => {
    postsApi.list.mockReturnValue(
      throwError(() => new Error('Failed to load posts')),
    );

    service.loadPostList();

    expect(service.listState().status).toBe('error');
    expect(service.hasListError()).toBe(true);
    expect(service.posts()).toEqual([]);
  });

  it('loads selected post details and comments', () => {
    postsApi.getById.mockReturnValue(
      of({ userId: 1, id: 5, title: 'Selected', body: 'Post' }),
    );
    postsApi.listComments.mockReturnValue(
      of([
        {
          postId: 5,
          id: 1,
          name: 'Comment',
          email: 'comment@example.com',
          body: 'Text',
        },
      ]),
    );

    service.selectPost(5);

    expect(service.selectedPostId()).toBe(5);
    expect(service.selectedPost()).toEqual({
      userId: 1,
      id: 5,
      title: 'Selected',
      body: 'Post',
    });
    expect(service.comments()).toEqual([
      {
        postId: 5,
        id: 1,
        name: 'Comment',
        email: 'comment@example.com',
        body: 'Text',
      },
    ]);
    expect(service.isSelectedPostLoading()).toBe(false);
    expect(service.isCommentListLoading()).toBe(false);
  });

  it('resets back to idle and clears selection', () => {
    postsApi.list.mockReturnValue(
      of([
        { userId: 1, id: 1, title: 'A', body: 'B' },
      ]),
    );
    postsApi.getById.mockReturnValue(
      of({ userId: 1, id: 5, title: 'Selected', body: 'Post' }),
    );
    postsApi.listComments.mockReturnValue(
      of([
        {
          postId: 5,
          id: 1,
          name: 'Comment',
          email: 'comment@example.com',
          body: 'Text',
        },
      ]),
    );

    service.loadPostList();
    service.selectPost(5);

    service.reset();

    expect(service.listState()).toEqual({ status: 'idle' });
    expect(service.selectedPostState()).toEqual({ status: 'idle' });
    expect(service.commentState()).toEqual({ status: 'idle' });
    expect(service.selectedPostId()).toBeNull();
    expect(service.posts()).toEqual([]);
    expect(service.selectedPost()).toBeNull();
    expect(service.comments()).toEqual([]);
    expect(service.isListLoading()).toBe(false);
  });
});
