import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  resource,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { firstValueFrom } from 'rxjs';
import { Post } from '../../../../core/http/models/post';
import { isApiError } from '../../../../core/http/models/api-error';
import { PostsApi } from '../../data-access/posts-api';

@Component({
  selector: 'app-home-page',
  imports: [TranslocoDirective],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  private readonly postsApi = inject(PostsApi);

  readonly postsResource = resource({
    defaultValue: [] as readonly Post[],
    loader: async () => firstValueFrom(this.postsApi.listPosts(8)),
  });

  readonly apiErrorMessage = computed(() => {
    const error = this.postsResource.error();
    if (!error || !isApiError(error) || error.kind !== 'http') {
      return null;
    }

    return error.message;
  });

  readonly apiErrorTranslationKey = computed(() => {
    const error = this.postsResource.error();
    if (!error || !isApiError(error)) {
      return 'errors.unknown';
    }

    return error.i18nKey;
  });
}
