import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, retry, tap, throwError, timeout } from 'rxjs';
import { Movie, MovieResponse } from '../interfaces/movie.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  // protected readonly http = inject(HttpClient);
  // protected readonly baseUrl = 'https://api.imdbapi.dev/';

  // private readonly REQUEST_TIMEOUT = 5000;
  // private readonly RETRY_COUNT = 2;


  // public getMovies(pageToken?: string): Observable<MovieResponse> {
  //   let url = `${this.baseUrl}titles?types=MOVIE`;
  //   if (pageToken) {
  //     url += `&nextPageToken=${encodeURIComponent(pageToken)}`;
  //   }
  //   console.log('Fetching movies from: ', url);

  //   return this.http.get<MovieResponse>(url).pipe(
  //     timeout(this.REQUEST_TIMEOUT),
  //     retry(this.RETRY_COUNT),
  //     tap(response => {
  //       console.log('Movies response: ', {
  //         count: response.titles?.length || 0,
  //         total: response.totalCount,
  //         hasNextPage: response.nextPageToken
  //       });
  //     }),
  //     map(response => this.normalizeResponse(response)),
  //     catchError(error => this.handleError(error, 'getMovies'))
  //   );
  // }

  // public getMovieById(id: string): Observable<Movie> {
  //   const url = `${this.baseUrl}titles/${id}`;

  //   return this.http.get<Movie>(url).pipe(
  //     timeout(this.REQUEST_TIMEOUT),
  //     retry(this.RETRY_COUNT),
  //     map(movie => this.normalizeMovie(movie)),
  //     catchError(error => this.handleError(error, 'getMovieById'))
  //   );
  // }

  // public searchMovies(query: string, pageToken?: string): Observable<MovieResponse> {
  //   if (!query || query.trim().length === 0) {
  //     return this.getMovies(pageToken);
  //   }

  //   let url = `${this.baseUrl}search/titles?query=${encodeURIComponent(query.trim())}`;

  //   if (pageToken) {
  //     url += `$nextPageToken=${encodeURIComponent(pageToken)}`;
  //   }

  //   console.log('Searching movies from: ', url);

  //   return this.http.get<MovieResponse>(url).pipe(
  //     timeout(this.REQUEST_TIMEOUT),
  //     retry(this.RETRY_COUNT),
  //     map(response => {
  //       console.log('Search response: ', {
  //         query,
  //         count: response.titles?.length || 0,
  //         total: response.totalCount,
  //         hasNextPage: !!response.nextPageToken
  //       });
  //     }),
  //     map(response => this.normalizeResponse(response)),
  //     catchError(error => this.handleError(error, 'searchMovies'))
  //   );
  // }

  // private normalizeResponse(response: any): MovieResponse {
  //   let titles: Movie[] = [];
  //   let totalCount = 0;
  //   let nextPageToken = undefined;

  //   if (Array.isArray(response.titles)) {
  //     titles = response.titles.map((movie: any) => this.normalizeResponse(movie));
  //   } else if (Array.isArray(response.results)) {
  //     titles = response.results.map((movie: any) => this.normalizeResponse(movie));
  //   }

  //   if (typeof response.totalCount === 'number') {
  //     totalCount = response.totalCount;
  //   } else if (typeof response.total === 'number') {
  //     totalCount = response.total;
  //   } else if (typeof response.totalResults === 'number') {
  //     totalCount = response.totalResults;
  //   } else {
  //     totalCount = titles.length;
  //   }

  //   if (response.nextPageToken) {
  //     nextPageToken = response.nextPageToken;
  //   } else if (response.next) {
  //     nextPageToken = response.next;
  //   }

  //   return {
  //     titles,
  //     totalCount,
  //     nextPageToken
  //   };
  // }

  // private normalizeMovie(movie: any): Movie {
  //   return {
  //     id: movie.id || movie.tconst || '',
  //     type: movie.type || movie.titleType || 'movie',
  //     primaryTitle: movie.primaryTitle || movie.title || movie.originalTitle || 'No name',
  //     originalTitle: movie.originalTitle || movie.primaryTitle || movie.title || 'No Title',
  //     primaryImage: movie.primaryImage || movie.image || {
  //       url: movie.prinaryTitle,
  //       width: 300,
  //       height: 450
  //     },
  //     startYear: movie.startYear || movie.year || movie.releaseYear || new Date().getFullYear(),
  //     runtimeSeconds: movie.runtimeSeconds || (movie.runtimeSeconds ? movie.runtimeMinutes * 60 : undefined),
  //     genres: Array.isArray(movie.genres)
  //       ? movie.genres
  //       : (typeof movie.genres === 'string' ? movie.genres.split(',') : []),
  //     rating: movie.rating.aggregateRating || (movie.ratings ? {
  //       aggregateRating: movie.rating?.aggregateRating || movie.ratings?.average || 0,
  //       voteCount: movie.rating?.voteCount || movie.ratings?.votes || 0
  //     }: undefined),
  //     plot: movie.plot || movie.description || movie.overview || ''
  //   };
  // }

  // private handleError(error: Error, context: string): Observable<never> {
  //   let errorMessage = 'Ошибка при загрузке';
  //   let errorDetails = '';

  //   if (error instanceof HttpErrorResponse) {
  //     switch (error.status) {
  //       case 0:
  //         errorMessage = 'Нет подключения';
  //         break;
  //       case 400:
  //         errorMessage = 'Неверный запрос к API';
  //         errorDetails = error.error?.message || '';
  //         break;
  //       case 401:
  //         errorMessage = 'Ошибка авторизации';
  //         break;
  //       case 403:
  //         errorMessage = 'Доступ к API запрещен';
  //         break;
  //       case 404:
  //         errorMessage = 'Данные не найдены';
  //         break;
  //       case 500:
  //         errorMessage = 'Сервер недоступен';
  //         break;
  //       default:
  //         errorMessage = `Ошибка ${error.status}: ${error.message}`;
  //     }
  //     errorDetails = error.error?.message || error.message || '';
  //   } else if (error.name === 'TimeoutError') {
  //     errorMessage = 'Превышено время ожидания';
  //   } else if (error.message) {
  //     errorDetails = error.message;
  //   }

  //   console.error(`[MovieService.${context}]`, {
  //     error,
  //     message: errorMessage,
  //     details: errorDetails
  //   });

  //   return throwError(() => new Error(`${errorMessage}${errorDetails ? ': ' + errorDetails : ''}`))
  // }

  // public checkApiHealth(): Observable<boolean> {
  //   const url = `${this.baseUrl}titles&types=MOVIE`;

  //   return this.http.get<any>(url).pipe(
  //     timeout(this.REQUEST_TIMEOUT),
  //     retry(this.RETRY_COUNT),
  //     map(response => response.status === 200 && response.body?.titles !== undefined),
  //     catchError(() => throwError(() => new Error('IMDB API недоступен')))
  //   );
  // }

  // public formatRuntime(seconds?: number): string {
  //   if (!seconds) return 'N/A';

  //   const hours = Math.floor(seconds / 3600);
  //   const minutes = Math.floor((seconds / 3600) / 60);

  //   if (hours > 0) {
  //     return `${hours}ч ${minutes}мин`
  //   }
  //   return `${minutes}мин`
  // }

  // public getRatingClass(rating?: number): string {
  //   if (!rating) return 'ratung-default';

  //   if (rating >= 8) return 'rating-exellent';
  //   if (rating >= 7) return 'rating-good';
  //   if (rating >= 6) return 'rating-average';
  //   if (rating >= 5) return 'rating-poor';
  //   return 'rating-bad';
  // }

  // public getRatingStars(rating?: number): { full: number, half: boolean, empty: number } {
  //   if (!rating) return { full: 0, half: false, empty: 5 }

  //   const normalized = rating / 2;
  //   const full = Math.floor(normalized);
  //   const half = normalized - full >= 0.5;
  //   const empty = 5 - full - (half ? 1 : 0);

  //   return { full, half, empty };

  // }


  protected readonly http = inject(HttpClient);
  protected readonly apiGet = 'https://api.imdbapi.dev/titles?types=MOVIE';
  protected readonly apiSearch = 'https://api.imdbapi.dev/search/titles?query';

  public getMovies(): Observable<Movie[]> {
    return this.http.get<{ titles: Movie[] }>(this.apiGet).pipe(
      map(response =>
        response.titles
      )
    );
  }

  searchMovies(query: string): Observable<Movie[]> {
    const api = `${this.apiSearch}=${encodeURIComponent(query)}`;


    return this.http.get<{ titles: Movie[] }>(api).pipe(
      map(response =>
        response.titles
      )
    );
  }
}
