import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { of } from 'rxjs';

import { HomePage } from './home-page';
import { PostsApi } from '../../data-access/posts-api';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomePage,
        TranslocoTestingModule.forRoot({
          translocoConfig: {
            availableLangs: ['en'],
            defaultLang: 'en',
          },
          langs: {
            en: {},
          },
        }),
      ],
      providers: [
        {
          provide: PostsApi,
          useValue: {
            listPosts: () => of([]),
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
