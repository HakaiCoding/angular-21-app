import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Translation,
  TranslocoLoader,
  TranslocoLoaderData,
} from '@jsverse/transloco';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly http = inject(HttpClient);

  getTranslation(
    lang: string,
    data?: TranslocoLoaderData,
  ): Observable<Translation> {
    const path = lang.includes('/')
      ? `/i18n/${lang}.json`
      : data?.scope
        ? `/i18n/${data.scope}/${lang}.json`
        : `/i18n/${lang}.json`;

    return this.http.get<Translation>(path);
  }
}
