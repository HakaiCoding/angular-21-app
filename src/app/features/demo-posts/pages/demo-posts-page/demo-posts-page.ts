import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoDirective } from '@jsverse/transloco';
import { PostsStore } from '../../data-access/posts-store';

@Component({
  selector: 'app-demo-posts-page',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    TranslocoDirective,
  ],
  templateUrl: './demo-posts-page.html',
  styleUrl: './demo-posts-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoPostsPage implements OnInit {
  private readonly postsStore = inject(PostsStore);

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
}
