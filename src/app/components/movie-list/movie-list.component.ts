import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { Movie } from '../../models/movie';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  imageBaseUrl: string = environment.imageBaseUrl;
  isLoading: boolean = true;
  error: string | null = null;
  currentPage: number = 1;
  totalPages: number = 1;
  genres: any[] = [];
  selectedGenre: number | null = null;

  constructor(private contentService: ContentService) { }

  ngOnInit(): void {
    this.loadMovies();
    this.loadGenres();
  }

  loadMovies(): void {
    this.isLoading = true;
    this.contentService.getPopularMovies(this.currentPage).subscribe({
      next: (data) => {
        this.movies = data.results;
        this.totalPages = Math.min(data.total_pages, 500); // API usually limits to 500 pages
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Filmler yüklenirken bir hata oluştu';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  loadGenres(): void {
    this.contentService.getMovieGenres().subscribe({
      next: (data) => {
        this.genres = data.genres;
      },
      error: (err) => {
        console.error('Film türleri yüklenirken hata oluştu:', err);
      }
    });
  }

  filterByGenre(genreId: number | null): void {
    this.selectedGenre = genreId;
    this.currentPage = 1;
    this.loadFilteredMovies();
  }

  loadFilteredMovies(): void {
    this.isLoading = true;

    if (this.selectedGenre) {
      this.contentService.getMoviesByGenre(this.selectedGenre, this.currentPage).subscribe({
        next: (data) => {
          this.movies = data.results;
          this.totalPages = Math.min(data.total_pages, 500);
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Filmler filtrelenirken bir hata oluştu';
          this.isLoading = false;
          console.error(err);
        }
      });
    } else {
      this.loadMovies();
    }
  }

  loadPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      if (this.selectedGenre) {
        this.loadFilteredMovies();
      } else {
        this.loadMovies();
      }
      window.scrollTo(0, 0);
    }
  }

  loadNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      if (this.selectedGenre) {
        this.loadFilteredMovies();
      } else {
        this.loadMovies();
      }
      window.scrollTo(0, 0);
    }
  }

  getYear(dateString: string): string {
    if (!dateString) return 'Bilinmiyor';
    return new Date(dateString).getFullYear().toString();
  }
}




