import { Component, computed, inject, signal } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, debounceTime, distinctUntilChanged, map, Observable, Subject, switchMap, tap, throwError } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.scss',
})
export class MovieList {
  protected readonly movieService = inject(MovieService);
  protected readonly router = inject(Router);

  private readonly debounceTime = 100;
  protected readonly searchTerm = new BehaviorSubject<string>("");
  protected readonly debouncedSearchTerm = this.searchTerm.pipe(
    debounceTime(this.debounceTime),
    distinctUntilChanged()
  )

  protected readonly items = this.debouncedSearchTerm.pipe(
    switchMap(searchTerm => {
      if (searchTerm) {
        return this.movieService.searchMovies(searchTerm)
      }
      return this.movieService.getMovies();
    })
  );

  protected handleError(error: Error) {
    console.error(error);
    return error;
  }
}
