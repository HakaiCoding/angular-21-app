import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { PostsStore } from '../../data-access/posts-store';
import { DemoPostsPage } from './demo-posts-page';

describe('DemoPostsPage', () => {
  let component: DemoPostsPage;
  let fixture: ComponentFixture<DemoPostsPage>;
  let postsStoreStub: {
    posts: ReturnType<typeof signal>;
    selectedPost: ReturnType<typeof signal>;
    comments: ReturnType<typeof signal>;
    listState: ReturnType<typeof signal>;
    selectedPostState: ReturnType<typeof signal>;
    commentState: ReturnType<typeof signal>;
    selectedPostId: ReturnType<typeof signal>;
    isListLoading: ReturnType<typeof signal>;
    hasListError: ReturnType<typeof signal>;
    isSelectedPostLoading: ReturnType<typeof signal>;
    hasSelectedPostError: ReturnType<typeof signal>;
    isCommentListLoading: ReturnType<typeof signal>;
    hasCommentListError: ReturnType<typeof signal>;
    loadPostList: ReturnType<typeof vi.fn>;
    selectPost: ReturnType<typeof vi.fn>;
    clearSelection: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    postsStoreStub = {
      posts: signal([]),
      selectedPost: signal(null),
      comments: signal([]),
      listState: signal({ status: 'idle' }),
      selectedPostState: signal({ status: 'idle' }),
      commentState: signal({ status: 'idle' }),
      selectedPostId: signal(null),
      isListLoading: signal(false),
      hasListError: signal(false),
      isSelectedPostLoading: signal(false),
      hasSelectedPostError: signal(false),
      isCommentListLoading: signal(false),
      hasCommentListError: signal(false),
      loadPostList: vi.fn(),
      selectPost: vi.fn(),
      clearSelection: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        DemoPostsPage,
        TranslocoTestingModule.forRoot({
          translocoConfig: {
            availableLangs: ['en'],
            defaultLang: 'en',
          },
          langs: {
            en: {
              demoPosts: {
                title: 'Demo Posts',
                description: 'Demo',
                actions: {
                  reload: 'Reload',
                  tryAgain: 'Try again',
                  clearSelection: 'Clear selection',
                },
                sections: {
                  posts: 'Posts',
                  selectedPost: 'Selected Post',
                  comments: 'Comments',
                },
                states: {
                  loadingPosts: 'Loading posts',
                  errorPosts: 'Error posts',
                  emptyPosts: 'No posts',
                  selectPost: 'Select a post',
                  loadingSelectedPost: 'Loading selected post',
                  errorSelectedPost: 'Error selected post',
                  selectPostForComments: 'Select post for comments',
                  loadingComments: 'Loading comments',
                  errorComments: 'Error comments',
                  emptyComments: 'No comments',
                },
                labels: {
                  postId: 'Post ID',
                  userId: 'User ID',
                },
              },
            },
          },
        }),
      ],
      providers: [
        {
          provide: PostsStore,
          useValue: postsStoreStub,
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoPostsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads posts on init', () => {
    fixture.detectChanges();
    expect(postsStoreStub.loadPostList).toHaveBeenCalledWith({ limit: 10 });
  });
});
