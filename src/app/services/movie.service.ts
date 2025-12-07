import { SearchResult } from './../interfaces/movie.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Movie } from '../interfaces/movie.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
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

  searchMovies(query: string): Observable<Movie[]>{
    const api = `${this.apiSearch}=${encodeURIComponent(query)}`;
    return this.http.get<{ titles: Movie[] }>(api).pipe(
      map(response =>
        response.titles
      )
    );
  }
}
