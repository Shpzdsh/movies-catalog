import { Component, computed, inject, signal } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, debounceTime, distinctUntilChanged, map, Observable, Subject, switchMap, tap, throwError } from 'rxjs';
import { AsyncPipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe ],
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

  protected hoveredMovieId: string | null = null;
  protected hoveredTimeout: any = null;
  protected showQuickView = false;

  protected quickViewPosition = { x: 0, y: 0 };

  protected onMovieHover(event: MouseEvent, movie: any): void {
    if (this.hoveredTimeout) {
      clearTimeout(this.hoveredTimeout);
    }

    this.hoveredMovieId = movie.id;
    this.quickViewPosition = {
      x: event.clientX + 20,
      y: event.clientY + 20
    };

    this.hoveredTimeout = setTimeout(() => {
      this.showQuickView = true;
    }, 300);
  }

  protected onMovieLeave(): void {
    if (this.hoveredTimeout) {
      clearTimeout(this.hoveredTimeout);
    }

    this.hoveredTimeout = setTimeout(() => {
      this.showQuickView = false;
      this.hoveredMovieId = null;
    }, 200);
  }

  protected onQuickViewEnter(): void {
    if (this.hoveredTimeout) {
      clearTimeout(this.hoveredTimeout);
    }
  }

  protected onQuickViewLeaved(): void {
    this.onMovieLeave();
  }

}
