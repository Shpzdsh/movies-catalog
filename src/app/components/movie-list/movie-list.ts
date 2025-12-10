import { Component, computed, DestroyRef, effect, HostListener, inject, signal } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, debounceTime, distinctUntilChanged, finalize, map, Observable, of, Subject, switchMap, tap, throwError } from 'rxjs';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Movie, MovieResponse } from '../../interfaces/movie.model';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.scss',
})
export class MovieList {

  protected readonly movieService = inject(MovieService);
  protected readonly router = inject(Router);
  protected readonly destroyRef = inject(DestroyRef);

  private readonly debounceTime = 100;
  protected readonly searchTerm = new BehaviorSubject<string>("");
  protected readonly debouncedSearchTerm = this.searchTerm.pipe(
    debounceTime(this.debounceTime),
    distinctUntilChanged()
  )

  protected readonly QUICK_VIEW_WIDTH = 420;
  protected readonly QUICK_VIEW_HEIGHT = 420;
  protected readonly QUICK_VIEW_OFFSET = 20;
  protected readonly SCREEN_MARGIN = 20;


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

  protected fullMovieDetails = signal<Movie | null>(null);
  protected loadingFullMovie = signal(false);

  @HostListener('window:resize')
  onWindowResize() {
    if (this.showQuickView) {
      this.adjustQuickViewPosition();
    }
  }

  protected onMovieHover(event: MouseEvent, movie: any): void {
    if (this.hoveredTimeout) {
      clearTimeout(this.hoveredTimeout);
    }

    this.hoveredMovieId = movie.id;
    this.quickViewPosition = {
      x: event.clientX + 20,
      y: event.clientY + 20
    };

    const hasFullDetails = movie.runtimeSeconds && movie.genres && movie.plot;

    if (!hasFullDetails) {
      this.loadingFullMovie.set(true);
      this.movieService.getMovieById(movie.id).pipe(
        takeUntilDestroyed(this.destroyRef)
      )
        .subscribe({
          next: (fullMovie) => {
            this.fullMovieDetails.set(fullMovie);
            this.loadingFullMovie.set(false);
          },
          error: (error) => {
            console.error('Error loading full movie details', error);
            this.loadingFullMovie.set(false);
            this.fullMovieDetails.set(movie);
          }
        });
    } else {
      this.fullMovieDetails.set(movie);
    }
    this.hoveredTimeout = setTimeout(() => {
      this.showQuickView = true;
      setTimeout(() => this.adjustQuickViewPosition(), 0);
    }, 300);
  }

  private calculateQuickViewPosition(event: MouseEvent): void {
    let x = event.clientX + this.QUICK_VIEW_OFFSET;
    let y = event.clientY + this.QUICK_VIEW_OFFSET;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (x + this.QUICK_VIEW_WIDTH > viewportWidth - this.SCREEN_MARGIN) {
      x = event.clientX - this.QUICK_VIEW_WIDTH - this.QUICK_VIEW_OFFSET;
    }

    if (y + this.QUICK_VIEW_HEIGHT > viewportHeight - this.SCREEN_MARGIN) {
      y = event.clientY - this.QUICK_VIEW_HEIGHT - this.QUICK_VIEW_OFFSET;
    }

     if (x < this.SCREEN_MARGIN) {
      x = this.SCREEN_MARGIN;
    }

    if (y < this.SCREEN_MARGIN) {
      y = this.SCREEN_MARGIN;
    }

    this.quickViewPosition = { x, y };
  }

  private adjustQuickViewPosition(): void {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let { x, y } = this.quickViewPosition;

    if (x + this.QUICK_VIEW_WIDTH > viewportWidth - this.SCREEN_MARGIN) {
      x = viewportWidth - this.QUICK_VIEW_WIDTH - this.SCREEN_MARGIN;
    }

    if (y + this.QUICK_VIEW_HEIGHT > viewportHeight - this.SCREEN_MARGIN) {
      y = viewportHeight - this.QUICK_VIEW_HEIGHT - this.SCREEN_MARGIN;
    }

    if (x < this.SCREEN_MARGIN) {
      x = this.SCREEN_MARGIN;
    }

    if (y < this.SCREEN_MARGIN) {
      y = this.SCREEN_MARGIN;
    }

    this.quickViewPosition = { x, y };
  }


  protected onMovieLeave(): void {
    if (this.hoveredTimeout) {
      clearTimeout(this.hoveredTimeout);
    }

    this.hoveredTimeout = setTimeout(() => {
      this.showQuickView = false;
      this.hoveredMovieId = null;
      this.fullMovieDetails.set(null);
      this.loadingFullMovie.set(false);
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

  protected getMovieForQuickView(): Movie | null {
    return this.fullMovieDetails();
  }

}
