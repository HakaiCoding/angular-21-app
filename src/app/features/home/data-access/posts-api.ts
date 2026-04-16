import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  JsonPlaceholderPostDto,
  mapPostDto,
  Post,
} from '../../../core/http/models/post';
import { API_CONFIG } from '../../../core/http/tokens/api-config';

@Injectable({
  providedIn: 'root',
})
export class PostsApi {
  private readonly http = inject(HttpClient);
  private readonly config = inject(API_CONFIG);

  listPosts(limit = 10): Observable<readonly Post[]> {
    const params = new HttpParams().set('_limit', String(limit));

    return this.http
      .get<readonly JsonPlaceholderPostDto[]>(`${this.config.baseUrl}/posts`, {
        params,
      })
      .pipe(map((posts) => posts.map(mapPostDto)));
  }
}
