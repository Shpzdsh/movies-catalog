import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, retry, tap, throwError, timeout } from 'rxjs';
import { Movie, MovieResponse } from '../interfaces/movie.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {

  protected readonly http = inject(HttpClient);
  protected readonly baseUrl = 'https://api.imdbapi.dev/'
  protected readonly apiGet = 'https://api.imdbapi.dev/titles?types=MOVIE';

  public getMovies(): Observable<Movie[]> {
    const url = `${this.baseUrl}titles?types=MOVIE`;

    return this.http.get<{ titles: Movie[] }>(url).pipe(
      tap(response => {
        console.log(response, 'getMovies')
      }),
      map(response =>
        response.titles
      )
    );
  }

  public getMovieById(id: string): Observable<Movie> {
    const url = `${this.baseUrl}titles/${id}`;

    return this.http.get<Movie>(url).pipe(
      tap(response => {
        console.log(response, 'getMovieById')
      }),
      map(responce =>
        responce
      )
    )
  }

    protected readonly apiSearch = 'https://api.imdbapi.dev/search/titles?query';


  searchMovies(query: string): Observable<Movie[]> {
    const url = `${this.baseUrl}search/titles?query=${encodeURIComponent(query)}`;

    return this.http.get<{ titles: Movie[] }>(url).pipe(
      tap(response => {
        console.log(response.titles, 'searchMovies')
      }),
      map(response =>
        response.titles
      )
    );
  }
}
