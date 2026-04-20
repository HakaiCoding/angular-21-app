import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslocoDirective } from '@jsverse/transloco';
import { EmptyStateComponent } from '../../../../shared/ui/states/empty-state/empty-state';
import { ErrorStateComponent } from '../../../../shared/ui/states/error-state/error-state';
import { LoadingStateComponent } from '../../../../shared/ui/states/loading-state/loading-state';
import type { StateAction, UiCopy } from '../../../../shared/ui/state/types';
import { PostsStore } from '../../data-access/posts-store';

@Component({
  selector: 'app-demo-posts-page',
  imports: [
    MatButtonModule,
    MatCardModule,
    TranslocoDirective,
    LoadingStateComponent,
    ErrorStateComponent,
    EmptyStateComponent,
  ],
  templateUrl: './demo-posts-page.html',
  styleUrl: './demo-posts-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoPostsPage implements OnInit {
  private readonly postsStore = inject(PostsStore);
  readonly retryStateAction: StateAction = {
    id: 'retry',
    label: { kind: 'key', key: 'demoPosts.actions.tryAgain' },
    variant: 'outlined',
  };

  readonly loadingPostsCopy: UiCopy = {
    kind: 'key',
    key: 'demoPosts.states.loadingPosts',
  };

  readonly loadingSelectedPostCopy: UiCopy = {
    kind: 'key',
    key: 'demoPosts.states.loadingSelectedPost',
  };

  readonly loadingCommentsCopy: UiCopy = {
    kind: 'key',
    key: 'demoPosts.states.loadingComments',
  };

  readonly errorPostsCopy: UiCopy = {
    kind: 'key',
    key: 'demoPosts.states.errorPosts',
  };

  readonly errorSelectedPostCopy: UiCopy = {
    kind: 'key',
    key: 'demoPosts.states.errorSelectedPost',
  };

  readonly errorCommentsCopy: UiCopy = {
    kind: 'key',
    key: 'demoPosts.states.errorComments',
  };

  readonly emptyPostsCopy: UiCopy = {
    kind: 'key',
    key: 'demoPosts.states.emptyPosts',
  };

  readonly selectPostCopy: UiCopy = {
    kind: 'key',
    key: 'demoPosts.states.selectPost',
  };

  readonly selectPostForCommentsCopy: UiCopy = {
    kind: 'key',
    key: 'demoPosts.states.selectPostForComments',
  };

  readonly emptyCommentsCopy: UiCopy = {
    kind: 'key',
    key: 'demoPosts.states.emptyComments',
  };

  readonly posts = this.postsStore.posts;
  readonly selectedPost = this.postsStore.selectedPost;
  readonly comments = this.postsStore.comments;

  readonly listState = this.postsStore.listState;
  readonly selectedPostState = this.postsStore.selectedPostState;
  readonly commentState = this.postsStore.commentState;

  readonly selectedPostId = this.postsStore.selectedPostId;
  readonly isListLoading = this.postsStore.isListLoading;
  readonly hasListError = this.postsStore.hasListError;
  readonly isSelectedPostLoading = this.postsStore.isSelectedPostLoading;
  readonly hasSelectedPostError = this.postsStore.hasSelectedPostError;
  readonly isCommentListLoading = this.postsStore.isCommentListLoading;
  readonly hasCommentListError = this.postsStore.hasCommentListError;

  ngOnInit(): void {
    this.reloadPosts();
  }

  reloadPosts(): void {
    this.postsStore.loadPostList({ limit: 10 });
  }

  selectPost(postId: number): void {
    this.postsStore.selectPost(postId);
  }

  clearSelection(): void {
    this.postsStore.clearSelection();
  }

  onListErrorAction(actionId: string): void {
    if (actionId === this.retryStateAction.id) {
      this.reloadPosts();
    }
  }

  onSelectedPostErrorAction(actionId: string): void {
    const selectedPostId = this.selectedPostId();
    if (actionId === this.retryStateAction.id && selectedPostId !== null) {
      this.selectPost(selectedPostId);
    }
  }

  onCommentErrorAction(actionId: string): void {
    const selectedPostId = this.selectedPostId();
    if (actionId === this.retryStateAction.id && selectedPostId !== null) {
      this.selectPost(selectedPostId);
    }
  }
}
