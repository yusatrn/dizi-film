import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ApiService } from '../../services/api.service';
import { switchMap } from 'rxjs/operators';
import {DecimalPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-search-results',
  standalone: true,
  templateUrl: './search-results.component.html',
  imports: [
    DecimalPipe,
    NgClass,
    NgForOf,
    NgIf,
    FormsModule
  ],
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  searchQuery: string = '';
  results: any[] = [];
  loading: boolean = true;
  error: boolean = false;
  currentPage: number = 1;
  totalPages: number = 0;
  totalResults: number = 0;
  imageBaseUrl: string = 'https://image.tmdb.org/t/p/';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    // Query params'ı izle
    this.route.queryParams.pipe(
      switchMap(params => {
        this.searchQuery = params['query'] || '';
        this.currentPage = +params['page'] || 1;

        if (!this.searchQuery) {
          this.results = [];
          this.loading = false;
          return [];
        }

        this.loading = true;
        this.error = false;
        this.titleService.setTitle(`"${this.searchQuery}" için Sonuçlar | Film & Dizi`);

        // Arama işlemi
        return this.apiService.searchMulti(this.searchQuery, this.currentPage);
      })
    ).subscribe({
      next: (data: any) => {
        if (!data || !data.results) {
          this.results = [];
          this.totalResults = 0;
          this.totalPages = 0;
        } else {
          this.results = data.results.filter((item: any) =>
            item.media_type === 'movie' || item.media_type === 'tv'
          );
          this.totalResults = data.total_results;
          this.totalPages = data.total_pages;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Search error:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { query: this.searchQuery, page: page },
      queryParamsHandling: 'merge'
    });

    // Sayfa başına dön
    window.scrollTo(0, 0);
  }

  navigateToDetails(item: any): void {
    const type = item.media_type === 'movie' ? 'film' : 'dizi';
    this.router.navigate(['/detay', type, item.id]);
  }

  getMediaTypeLabel(type: string): string {
    return type === 'movie' ? 'Film' : 'Dizi';
  }

  getYear(date: string): string {
    return date ? new Date(date).getFullYear().toString() : 'Belirtilmemiş';
  }

  getPageNumber(index: number): number {
    // Toplam sayfa sayısı 7 veya daha az ise, doğrudan sayfayı göster
    if (this.totalPages <= 7) {
      return index + 1;
    }

    // Akıllı pagination algoritması
    if (index === 0) {
      return 1; // İlk sayfa her zaman 1
    } else if (index === 6) {
      return this.totalPages; // Son sayfa her zaman toplam sayfa
    } else if (index === 3) {
      return this.currentPage; // Ortada her zaman mevcut sayfa
    } else if (index === 2 && this.currentPage > 3) {
      return this.currentPage - 1; // Mevcut sayfanın solu
    } else if (index === 4 && this.currentPage < this.totalPages - 2) {
      return this.currentPage + 1; // Mevcut sayfanın sağı
    } else if (index === 1) {
      return this.currentPage > 3 ? 2 : 2; // Her zaman 2 döndür
    } else if (index === 5) {
      return this.currentPage < this.totalPages - 2 ? this.totalPages - 1 : this.totalPages - 1; // Her zaman sondan bir önceki
    }

    // Buraya asla ulaşılmamalı
    return 0;
  }
}
