import { Component, computed, DestroyRef, effect, HostListener, inject, signal } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, debounceTime, distinctUntilChanged, finalize, map, Observable, of, Subject, switchMap, tap, throwError } from 'rxjs';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Movie, MovieResponse } from '../../interfaces/movie.model';

interface QuickViewPosition {
  x: number,
  y: number,
}

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.scss',
})
export class MovieList {

  // private readonly movieService = inject(MovieService);
  // private readonly router = inject(Router);
  // private readonly destroyRef = inject(DestroyRef);

  // private readonly DEBOUNCE_TIME = 300;
  // private readonly QUICK_VIEW_WIDTH = 420;
  // private readonly QUICK_VIEW_HIGHT = 500;
  // private readonly QUICK_VIEW_OFFSET = 20;
  // private readonly SCREEN_MARGIN = 10;

  // protected readonly searchTerm = signal<string>('');
  // protected readonly isLoading = signal(true);
  // protected readonly isLoadingMore = signal(false);
  // protected readonly error = signal<string | null>(null);

  // protected readonly movies = signal<Movie[]>([]);
  // protected readonly totalCount = signal<number>(0);
  // protected readonly nextPageToken = signal<string | undefined>(undefined);

  // protected readonly hoveredMovieId = signal<string | null>(null);
  // protected readonly showQuickView = signal<boolean>(false);
  // protected readonly quickViewPosition = signal<QuickViewPosition>({ x: 0, y: 0 });

  // protected readonly hasMore = computed<boolean>(() =>
  //   this.movies().length < this.totalCount()
  // );

  // protected readonly hoveredMovie = computed<Movie | undefined>(() =>
  //   this.hoveredMovieId()
  //     ? this.movies().find(movie => movie.id === this.hoveredMovieId())
  //     : undefined
  // );

  // protected readonly showLoadMore = computed<boolean>(() =>
  //   this.hasMore() && !this.isLoading() && this.movies.length > 0
  // );

  // private hoverTimeout: ReturnType<typeof setTimeout> | null = null;
  // private hideTimeout: ReturnType<typeof setTimeout> | null = null;

  // private mousePosition = { x: 0, y: 0 };

  // private readonly searchTermObservable = toObservable(this.searchTerm).pipe(
  //   debounceTime(this.DEBOUNCE_TIME),
  //   distinctUntilChanged()
  // );

  // constructor() {

  //   this.initializeSearch();

  //   this.destroyRef.onDestroy(() => {
  //     this.clearTimeouts()
  //   });

  //   effect(() => {
  //     const error = this.error();
  //     if (error) {
  //       const timer = setTimeout(() => this.clearError(), 5000);
  //       return () => clearTimeout(timer);
  //     }
  //     return;
  //   });
  // }

  // private initializeSearch(): void {
  //   this.searchTermObservable.pipe(
  //     tap(() => {
  //       this.movies.set([]),
  //         this.nextPageToken.set(undefined),
  //         this.totalCount.set(0),
  //         this.isLoading.set(true),
  //         this.error.set(null)
  //     }),
  //     switchMap(searchTerm => {
  //       if (searchTerm) {
  //         return this.movieService.searchMovies(searchTerm).pipe(
  //           catchError(error =>
  //             this.handleError(error, 'Поиск')
  //           )
  //         );
  //       } else {
  //         return this.movieService.getMovies().pipe(
  //           catchError(error =>
  //             this.handleError(error, 'Загрузка')
  //           )
  //         );
  //       }
  //     }),
  //     takeUntilDestroyed(this.destroyRef)
  //   )
  //     .subscribe(response => {
  //       this.handleMoviesResponse(response);
  //     });
  // }

  // private handleError(error: any, context: string): Observable<MovieResponse> {
  //   console.error(`${context} error: `, error);
  //   this.error.set(`${context} не удался. ${error.message} || 'Попробуй позже.`);
  //   this.isLoading.set(false);
  //   this.isLoadingMore.set(false);
  //   return of({ titles: [], totalCount: 0 });
  // }

  // private handleMoviesResponse(response: MovieResponse): void {
  //   if (this.isLoadingMore()) {
  //     this.movies.update(movies => [...movies, ...response.titles]);
  //   } else {
  //     this.movies.set(response.titles);
  //   }

  //   this.totalCount.set(response.totalCount);
  //   this.isLoading.set(false);
  //   this.isLoadingMore.set(false);

  //   console.log('Movies loaded:', {
  //     loaded: this.movies().length,
  //     total: response.totalCount,
  //     hasMore: !!response.nextPageToken
  //   });
  // }

  // protected loadMore(): void {
  //   if (this.isLoadingMore() || !this.hasMore()) return;

  //   this.isLoadingMore.set(true);
  //   const token = this.nextPageToken();
  //   const currentSearchTerm = this.searchTerm();

  //   const request = currentSearchTerm
  //     ? this.movieService.searchMovies(currentSearchTerm, token)
  //     : this.movieService.getMovies(token);

  //   request?.pipe(
  //     takeUntilDestroyed(this.destroyRef),
  //     catchError(error => this.handleError(error, 'Дополнительныя загрузка')),
  //     finalize(() => this.isLoadingMore.set(false))
  //   )
  //     .subscribe(response => {
  //       this.handleMoviesResponse(response);
  //     });
  // }

  // protected onSearch(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   this.searchTerm.set(input.value.trim());
  // }

  // protected clearError(): void {
  //   this.error.set(null);
  // }

  // protected navigateToMovie(movieId: string): void {
  //   this.router.navigate(['/movie', movieId]);
  // }

  // private clearTimeouts(): void {
  //   if (this.hoverTimeout) {
  //     clearTimeout(this.hoverTimeout);
  //     this.hoverTimeout = null
  //   }

  //   if (this.hideTimeout) {
  //     clearTimeout(this.hideTimeout);
  //     this.hideTimeout = null;
  //   }
  // }

  // @HostListener('document:mousemove', ['$event'])
  // onMouseMove(event: MouseEvent): void {
  //   this.mousePosition = { x: event.clientX, y: event.clientY };

  //   if (this.showQuickView() && this.hoveredMovieId()) {
  //     this.updateQuickViewPosition();
  //   }
  // }

  // @HostListener('window.resize')
  // onWindowResize():void {
  //   if (this.showQuickView()) {
  //     this.updateQuickViewPosition();
  //   }
  // }

  // @HostListener('window.scroll')
  // onWindowScroll(): void {
  //   if (this.showQuickView()) {
  //     this.updateQuickViewPosition();
  //   }
  // }

  // protected onMovieHover(event: MouseEvent, moviedId: string): void {
  //   this.clearTimeouts();
  //   this.hoveredMovieId.set(moviedId);
  //   this.mousePosition = {x: event.clientX, y: event.clientY};
  //   this.hoverTimeout = setTimeout(() => {
  //     this.showQuickView.set(true);
  //     this.updateQuickViewPosition();
  //   }, 300);
  // }

  // protected onMovieLeave(): void {
  //   this.clearTimeouts();
  //   this.hideTimeout = setTimeout(() => {
  //     this.showQuickView.set(false);
  //     this.hoveredMovieId.set(null);
  //   }, 200);
  // }

  // protected onQuickViewEnter(): void {
  //   this.clearTimeouts();
  // }

  // protected onQuickViewLeave(): void {
  //   this.onMovieLeave();
  // }

  // private updateQuickViewPosition(): void {
  //   const adjustedPosition = this.adjustQuickViewposition(
  //     this.mousePosition.x,
  //     this.mousePosition.y
  //   );

  //   this.quickViewPosition.set(adjustedPosition);
  // }

  // private adjustQuickViewposition(clientX: number, clientY: number): QuickViewPosition {
  //   const viewport = this.getViewportInfo();

  //   let x = clientX + viewport.scrollX + this.QUICK_VIEW_OFFSET;
  //   let y = clientY + viewport.scrollY + this.QUICK_VIEW_OFFSET;

  //   const corrected = this.correctBoundaries(x, y, viewport);

  //   return {
  //     x: corrected.x - viewport.scrollX,
  //     y: corrected.y - viewport.scrollY,
  //   };
  // }

  // private getViewportInfo() {
  //   return {
  //     width: window.innerWidth,
  //     height: window.innerHeight,
  //     scrollX: window.scrollX || document.documentElement.scrollLeft,
  //     scrollY: window.scrollY || document.documentElement.scrollTop
  //   };
  // }

  // private correctBoundaries(x: number, y: number, viewport: any) {
  //   if (x + this.QUICK_VIEW_WIDTH > viewport.width + viewport.scrollX) {
  //     x = viewport.width + viewport.scrollX - this.QUICK_VIEW_WIDTH - this.SCREEN_MARGIN;
  //   }

  //   if (y + this.QUICK_VIEW_HIGHT > viewport.height + viewport.scrollY) {
  //     y = viewport.height + viewport.scrollY - this.QUICK_VIEW_HIGHT - this.SCREEN_MARGIN;
  //   }

  //   if (x < viewport.scrollX + this.SCREEN_MARGIN) {
  //     x = viewport.scrollX + this.SCREEN_MARGIN;
  //   }

  //   if (y < viewport.scrollY + this.SCREEN_MARGIN) {
  //     y = viewport.scrollY + this.SCREEN_MARGIN;
  //   }

  //   return { x, y };
  // }

  // protected formatRuntime(seconds?: number): string {
  //   return this.movieService.formatRuntime(seconds);
  // }

  // protected getRatingClass(rating?: number): string {
  //   return this.movieService.getRatingClass(rating);
  // }

  // protected getRatingStars(rating?: number): {full: number, half: boolean, empty: number} {
  //   return this.movieService.getRatingStars(rating);
  // }

  // protected trackByMovieId(index: number, movie: Movie): string {
  //   return movie.id;
  // }

  // protected handleImageError(event: Event): void {
  //   const img = event.target as HTMLImageElement;

  // }











  protected readonly movieService = inject(MovieService);
  protected readonly router = inject(Router);

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
