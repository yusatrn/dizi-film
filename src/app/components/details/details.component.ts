import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ContentService } from '../../services/content.service';
import { Movie } from '../../models/movie';
import { TvShow } from '../../models/tv-show';
import { environment } from '../../../environments/environment';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class DetailsComponent implements OnInit {
  type: string = '';
  id: number = 0;
  content: Movie | TvShow | null = null;
  imageBaseUrl: string = environment.imageBaseUrl;
  isLoading: boolean = true;
  error: string | null = null;

  // Yeni eklenen özellikler
  cast: any[] = [];
  crew: any[] = [];
  directors: any[] = [];
  writers: any[] = [];
  videos: any[] = [];
  trailerUrl: SafeResourceUrl | null = null;
  similarContent: any[] = [];
  reviews: any[] = [];
  activeTab: string = 'overview';

  // Sadece diziler için
  seasons: any[] = [];
  episodes: any[] = [];
  selectedSeason: number = 1;

  constructor(
    private route: ActivatedRoute,
    private contentService: ContentService,
    private sanitizer: DomSanitizer,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.type = params['type'];
      this.id = +params['id'];
      this.loadContent();
    });
  }

  loadContent(): void {
    this.isLoading = true;
    this.error = null;

    if (this.type === 'film') {
      // Film detayları ve ek bilgileri yükle
      const movieDetails$ = this.contentService.getMovieDetails(this.id);
      const movieCredits$ = this.contentService.getMovieCredits(this.id).pipe(
        catchError(() => of({ cast: [], crew: [] }))
      );
      const movieVideos$ = this.contentService.getMovieVideos(this.id).pipe(
        catchError(() => of({ results: [] }))
      );
      const similarMovies$ = this.contentService.getSimilarMovies(this.id).pipe(
        catchError(() => of({ results: [] }))
      );
      const movieReviews$ = this.contentService.getMovieReviews(this.id).pipe(
        catchError(() => of({ results: [] }))
      );

      forkJoin({
        details: movieDetails$,
        credits: movieCredits$,
        videos: movieVideos$,
        similar: similarMovies$,
        reviews: movieReviews$
      }).subscribe({
        next: (data) => {
          this.content = data.details as Movie;

          // Cast ve mürettebatı ayarla
          this.cast = data.credits.cast?.slice(0, 10) || [];
          this.crew = data.credits.crew || [];
          this.directors = this.crew.filter(person => person.job === 'Director');
          this.writers = this.crew.filter(person =>
            person.job === 'Screenplay' ||
            person.job === 'Writer' ||
            person.job === 'Story'
          );

          // Video ve fragmanları ayarla
          this.videos = data.videos.results || [];
          this.setTrailer();

          // Benzer içerikler ve incelemeler
          this.similarContent = data.similar.results?.slice(0, 6) || [];
          this.reviews = data.reviews.results || [];

          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Film detayları yüklenirken bir hata oluştu';
          this.isLoading = false;
          console.error(err);
        }
      });

    } else if (this.type === 'dizi') {
      // Dizi detayları ve ek bilgileri yükle
      const tvDetails$ = this.contentService.getTvShowDetails(this.id);
      const tvCredits$ = this.contentService.getTvCredits(this.id).pipe(
        catchError(() => of({ cast: [], crew: [] }))
      );
      const tvVideos$ = this.contentService.getTvVideos(this.id).pipe(
        catchError(() => of({ results: [] }))
      );
      const similarTv$ = this.contentService.getSimilarTvShows(this.id).pipe(
        catchError(() => of({ results: [] }))
      );
      const tvReviews$ = this.contentService.getTvReviews(this.id).pipe(
        catchError(() => of({ results: [] }))
      );

      forkJoin({
        details: tvDetails$,
        credits: tvCredits$,
        videos: tvVideos$,
        similar: similarTv$,
        reviews: tvReviews$
      }).subscribe({
        next: (data) => {
          this.content = data.details as TvShow;

          if (this.isTvShow(this.content)) {
            this.seasons = this.content.seasons || [];

            // Dizinin ilk sezon bilgilerini yükle
            if (this.seasons.length > 0) {
              this.loadSeasonDetails(this.id, this.selectedSeason);
            }
          }

          // Cast ve mürettebatı ayarla
          this.cast = data.credits.cast?.slice(0, 10) || [];
          this.crew = data.credits.crew || [];
          this.directors = this.crew.filter(person =>
            person.job === 'Director' ||
            person.job === 'Series Director'
          );
          this.writers = this.crew.filter(person =>
            person.job === 'Screenplay' ||
            person.job === 'Writer' ||
            person.job === 'Story' ||
            person.job === 'Series Writer' ||
            person.job === 'Creator'
          );

          // Video ve fragmanları ayarla
          this.videos = data.videos.results || [];
          this.setTrailer();

          // Benzer içerikler ve incelemeler
          this.similarContent = data.similar.results?.slice(0, 6) || [];
          this.reviews = data.reviews.results || [];

          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Dizi detayları yüklenirken bir hata oluştu';
          this.isLoading = false;
          console.error(err);
        }
      });
    }
  }

  // Type guards
  isMovie(content: Movie | TvShow): content is Movie {
    return (content as Movie).title !== undefined;
  }

  isTvShow(content: Movie | TvShow): content is TvShow {
    return (content as TvShow).name !== undefined;
  }

  loadSeasonDetails(tvId: number, seasonNumber: number): void {
    this.contentService.getTvSeasons(tvId, seasonNumber).subscribe({
      next: (data) => {
        this.episodes = data.episodes || [];
      },
      error: (err) => {
        console.error('Sezon detayları yüklenirken hata:', err);
        this.episodes = [];
      }
    });
  }

  changeSeason(seasonNumber: number): void {
    this.selectedSeason = seasonNumber;
    this.loadSeasonDetails(this.id, seasonNumber);
  }

  // Video ve fragman fonksiyonları
  setTrailer(): void {
    // Önce API'den gelen videoları kontrol et
    const trailer = this.videos.find(video =>
      video.type === 'Trailer' &&
      (video.site === 'YouTube' || video.site === 'Vimeo')
    );

    if (trailer) {
      if (trailer.site === 'YouTube') {
        this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${trailer.key}`
        );
      } else if (trailer.site === 'Vimeo') {
        this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://player.vimeo.com/video/${trailer.key}`
        );
      }
    } else {
      // Fragman bulunamadıysa boş bırak
      this.trailerUrl = null;
    }
  }

  getMainTrailer(): any {
    return this.videos.find(video =>
      video.type === 'Trailer' &&
      (video.site === 'YouTube' || video.site === 'Vimeo')
    );
  }

  getVideoThumbnail(video: any): string {
    if (video.site === 'YouTube') {
      return `https://img.youtube.com/vi/${video.key}/mqdefault.jpg`;
    }
    // Video için thumbnail yoksa
    return 'assets/video-placeholder.jpg';
  }

  openVideo(video: any): void {
    let url = '';
    if (video.site === 'YouTube') {
      url = `https://www.youtube.com/watch?v=${video.key}`;
    } else if (video.site === 'Vimeo') {
      url = `https://vimeo.com/${video.key}`;
    }

    if (url) {
      window.open(url, '_blank');
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getTitle(): string {
    if (!this.content) return '';
    return this.isMovie(this.content) ? this.content.title : this.content.name;
  }

  getReleaseDate(): string {
    if (!this.content) return '';
    return this.isMovie(this.content) ? this.content.release_date : this.content.first_air_date;
  }

  getReleaseYear(): string {
    const date = this.getReleaseDate();
    if (!date) return '';
    return new Date(date).getFullYear().toString();
  }

  getRuntime(): string {
    if (!this.content || !this.isMovie(this.content) || !this.content.runtime) return '';

    const hours = Math.floor(this.content.runtime / 60);
    const minutes = this.content.runtime % 60;

    if (hours === 0) return `${minutes} dk`;
    return `${hours} sa ${minutes} dk`;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  }

  goBack(): void {
    this.location.back();
  }

  // Helper functions for safer template access
  getNumberOfSeasons(): number | undefined {
    if (!this.content || !this.isTvShow(this.content)) return undefined;
    return this.content.number_of_seasons;
  }

  getNumberOfEpisodes(): number | undefined {
    if (!this.content || !this.isTvShow(this.content)) return undefined;
    return this.content.number_of_episodes;
  }

  getTagline(): string | undefined {
    if (!this.content) return undefined;
    return this.isMovie(this.content)
      ? this.content.tagline
      : (this.content as any).tagline;
  }

  getStatus(): string | undefined {
    if (!this.content) return undefined;
    return this.content.status;
  }

  getBudget(): number | undefined {
    if (!this.content || !this.isMovie(this.content)) return undefined;
    return this.content.budget;
  }

  getRevenue(): number | undefined {
    if (!this.content || !this.isMovie(this.content)) return undefined;
    return this.content.revenue;
  }

  getOriginalLanguage(): string | undefined {
    if (!this.content) return undefined;
    return this.content.original_language;
  }

  getProductionCompanies(): any[] | undefined {
    if (!this.content) return undefined;
    return this.content.production_companies;
  }


  playTrailer(): void {
    this.setActiveTab('videos');

    // Smooth scroll to the trailer section
    setTimeout(() => {
      const trailerElement = document.getElementById('trailer');
      if (trailerElement) {
        trailerElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }
}
