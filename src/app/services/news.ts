import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NewsApiResponse } from '../interfaces/article';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.newsApiUrl}/v2/top-headlines`;

  getTopHeadlines(page = 1, pageSize = 6): Observable<NewsApiResponse> {
    let params = new HttpParams()
      .set('country', 'us')
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (environment.newsApiKey) {
      params = params.set('apiKey', environment.newsApiKey);
    }

    return this.http.get<NewsApiResponse>(this.baseUrl, { params }).pipe(
      map(res => ({
        ...res,
        articles: res.articles.filter(a => a.title !== '[Removed]')
      }))
    );
  }
}
