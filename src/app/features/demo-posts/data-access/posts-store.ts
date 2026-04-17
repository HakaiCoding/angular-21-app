import { Injectable, computed, inject, signal } from '@angular/core';
import { take } from 'rxjs';
import type { Post, PostComment, PostListQuery } from './models/post';
import { PostsApi } from './posts-api';

export type RequestState<TData> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: TData }
  | { status: 'error'; error: unknown };

const idleState: RequestState<readonly Post[]> = { status: 'idle' };
const idlePostState: RequestState<Post> = { status: 'idle' };
const idleCommentState: RequestState<readonly PostComment[]> = { status: 'idle' };

@Injectable({
  providedIn: 'root',
})
export class PostsStore {
  private readonly postsApi = inject(PostsApi);
  private readonly selectedPostIdState = signal<number | null>(null);

  private readonly postListState = signal<RequestState<readonly Post[]>>(idleState);
  private readonly postState = signal<RequestState<Post>>(idlePostState);
  private readonly commentListState = signal<RequestState<readonly PostComment[]>>(idleCommentState);

  readonly listState = this.postListState.asReadonly();
  readonly selectedPostState = this.postState.asReadonly();
  readonly commentState = this.commentListState.asReadonly();
  readonly selectedPostId = this.selectedPostIdState.asReadonly();

  readonly posts = computed(() => {
    const state = this.postListState();
    return state.status === 'success' ? state.data : [];
  });

  readonly selectedPost = computed(() => {
    const state = this.postState();
    return state.status === 'success' ? state.data : null;
  });

  readonly comments = computed(() => {
    const state = this.commentListState();
    return state.status === 'success' ? state.data : [];
  });

  readonly isListLoading = computed(() => this.postListState().status === 'loading');
  readonly hasListError = computed(() => this.postListState().status === 'error');
  readonly isSelectedPostLoading = computed(() => this.postState().status === 'loading');
  readonly hasSelectedPostError = computed(() => this.postState().status === 'error');
  readonly isCommentListLoading = computed(() => this.commentListState().status === 'loading');
  readonly hasCommentListError = computed(() => this.commentListState().status === 'error');

  loadPostList(query: PostListQuery = {}): void {
    this.postListState.set({ status: 'loading' });

    this.postsApi.list(query).pipe(take(1)).subscribe({
      next: (posts) => {
        this.postListState.set({ status: 'success', data: posts });
      },
      error: (error: unknown) => {
        this.postListState.set({ status: 'error', error });
      },
    });
  }

  selectPost(postId: number): void {
    this.selectedPostIdState.set(postId);
    this.loadSelectedPost(postId);
    this.loadComments(postId);
  }

  clearSelection(): void {
    this.selectedPostIdState.set(null);
    this.postState.set(idlePostState);
    this.commentListState.set(idleCommentState);
  }

  reset(): void {
    this.postListState.set(idleState);
    this.clearSelection();
  }

  private loadSelectedPost(postId: number): void {
    this.postState.set({ status: 'loading' });

    this.postsApi.getById(postId).pipe(take(1)).subscribe({
      next: (post) => {
        this.postState.set({ status: 'success', data: post });
      },
      error: (error: unknown) => {
        this.postState.set({ status: 'error', error });
      },
    });
  }

  private loadComments(postId: number): void {
    this.commentListState.set({ status: 'loading' });

    this.postsApi.listComments(postId).pipe(take(1)).subscribe({
      next: (comments) => {
        this.commentListState.set({ status: 'success', data: comments });
      },
      error: (error: unknown) => {
        this.commentListState.set({ status: 'error', error });
      },
    });
  }
}
