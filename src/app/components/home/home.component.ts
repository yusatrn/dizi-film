import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { Movie } from '../../models/movie';
import { TvShow } from '../../models/tv-show';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class HomeComponent implements OnInit {
  popularMovies: Movie[] = [];
  popularTvShows: TvShow[] = [];
  imageBaseUrl: string = environment.imageBaseUrl;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(private contentService: ContentService) { }

  ngOnInit(): void {
    this.loadPopularContent();
  }

  loadPopularContent(): void {
    this.contentService.getPopularMovies().subscribe({
      next: (data) => {
        this.popularMovies = data.results.slice(0, 6);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Film verileri yüklenirken bir hata oluştu';
        this.isLoading = false;
        console.error(err);
      }
    });

    this.contentService.getPopularTvShows().subscribe({
      next: (data) => {
        this.popularTvShows = data.results.slice(0, 6);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Dizi verileri yüklenirken bir hata oluştu';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}
