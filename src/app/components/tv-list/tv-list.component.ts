import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { TvShow } from '../../models/tv-show';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tv-list',
  templateUrl: './tv-list.component.html',
  styleUrls: ['./tv-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class TvListComponent implements OnInit {
  tvShows: TvShow[] = [];
  imageBaseUrl: string = environment.imageBaseUrl;
  isLoading: boolean = true;
  error: string | null = null;
  currentPage: number = 1;
  totalPages: number = 1;
  genres: any[] = [];
  selectedGenre: number | null = null;

  constructor(private contentService: ContentService) { }

  ngOnInit(): void {
    this.loadTvShows();
    this.loadGenres();
  }

  loadTvShows(): void {
    this.isLoading = true;
    this.contentService.getPopularTvShows(this.currentPage).subscribe({
      next: (data) => {
        this.tvShows = data.results;
        this.totalPages = Math.min(data.total_pages, 500); // API usually limits to 500 pages
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Diziler yüklenirken bir hata oluştu';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  loadGenres(): void {
    this.contentService.getTvGenres().subscribe({
      next: (data) => {
        this.genres = data.genres;
      },
      error: (err) => {
        console.error('Dizi türleri yüklenirken hata oluştu:', err);
      }
    });
  }

  filterByGenre(genreId: number | null): void {
    this.selectedGenre = genreId;
    this.currentPage = 1;
    this.loadFilteredTvShows();
  }

  loadFilteredTvShows(): void {
    this.isLoading = true;

    if (this.selectedGenre) {
      this.contentService.getTvShowsByGenre(this.selectedGenre, this.currentPage).subscribe({
        next: (data) => {
          this.tvShows = data.results;
          this.totalPages = Math.min(data.total_pages, 500);
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Diziler filtrelenirken bir hata oluştu';
          this.isLoading = false;
          console.error(err);
        }
      });
    } else {
      this.loadTvShows();
    }
  }

  loadPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      if (this.selectedGenre) {
        this.loadFilteredTvShows();
      } else {
        this.loadTvShows();
      }
      window.scrollTo(0, 0);
    }
  }

  loadNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      if (this.selectedGenre) {
        this.loadFilteredTvShows();
      } else {
        this.loadTvShows();
      }
      window.scrollTo(0, 0);
    }
  }

  getYear(dateString: string): string {
    if (!dateString) return 'Bilinmiyor';
    return new Date(dateString).getFullYear().toString();
  }
}
