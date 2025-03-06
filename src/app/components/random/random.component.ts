import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { finalize } from 'rxjs/operators';
import {DatePipe, DecimalPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-random',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    NgIf,
  ],
  templateUrl: './random.component.html',
  styleUrl: './random.component.scss'
})
export class RandomComponent implements OnInit {
  randomMovie: any = null;
  randomTvShow: any = null;
  imageBaseUrl: string = 'https://image.tmdb.org/t/p/';
  loading: boolean = true;
  error: boolean = false;
  currentDate: string = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  constructor(
    private apiService: ApiService,
    private router: Router,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Rastgele Öneriler | Film & Dizi');
    this.getRandomRecommendations();
  }

  getRandomRecommendations(): void {
    this.loading = true;
    this.error = false;

    this.apiService.getPopularMovies(Math.floor(Math.random() * 5) + 1) // Random page between 1-5
      .pipe(
        finalize(() => {
          // Half of loading is complete
          if (this.randomTvShow !== null) {
            this.loading = false;
          }
        })
      )
      .subscribe({
        next: (data) => {
          const randomIndex = Math.floor(Math.random() * data.results.length);
          this.randomMovie = data.results[randomIndex];
        },
        error: (err) => {
          console.error('Error fetching random movie:', err);
          this.error = true;
          this.loading = false;
        }
      });

    // Get random TV show
    this.apiService.getPopularTvShows(Math.floor(Math.random() * 5) + 1) // Random page between 1-5
      .pipe(
        finalize(() => {
          // Half of loading is complete
          if (this.randomMovie !== null) {
            this.loading = false;
          }
        })
      )
      .subscribe({
        next: (data) => {
          const randomIndex = Math.floor(Math.random() * data.results.length);
          this.randomTvShow = data.results[randomIndex];
        },
        error: (err) => {
          console.error('Error fetching random TV show:', err);
          this.error = true;
          this.loading = false;
        }
      });
  }

  refreshRecommendations(): void {
    this.randomMovie = null;
    this.randomTvShow = null;
    this.getRandomRecommendations();
  }

  navigateToDetails(type: string, id: number): void {
    this.router.navigate(['/detay', type, id]);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return 'Belirtilmemiş';
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}
