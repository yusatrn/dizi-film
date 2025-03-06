import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  templateUrl: './search.component.html',
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
    DatePipe
  ],
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef;

  searchQuery: string = '';
  searchResults: any[] = [];
  searchHistory: string[] = [];
  isLoading: boolean = false;
  showResults: boolean = false;
  showHistory: boolean = false;
  selectedIndex: number = -1;
  subscription: Subscription = new Subscription();
  imageBaseUrl: string = 'https://image.tmdb.org/t/p/w92';

  constructor(
    private apiService: ApiService, // Bu sefer SearchService değil, ApiService kullanıyoruz
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchHistory = this.apiService.getSearchHistory();

    // Arama sonuçlarını dinle
    this.subscription.add(
      this.apiService.searchResults$.subscribe(response => {
        this.searchResults = response.results;
        this.isLoading = false;
        // Sonuç varsa dropdown'ı göster
        this.showResults = this.searchResults.length > 0 && this.searchQuery.trim().length > 0;
        this.selectedIndex = -1;
      })
    );
  }

  ngAfterViewInit(): void {
    // Döküman tıklamalarını dinle - dışarı tıklandığında dropdown'ı kapat
    this.subscription.add(
      fromEvent(document, 'click').subscribe((event: Event) => {
        if (this.searchInput && !this.searchInput.nativeElement.contains(event.target)) {
          this.showResults = false;
          this.showHistory = false;
        }
      })
    );
  }

  onFocus(): void {
    // Geçmiş aramaları göster
    if (this.searchQuery.trim() === '') {
      this.showHistory = this.searchHistory.length > 0;
      this.showResults = false;
    } else {
      this.showResults = this.searchResults.length > 0;
    }
  }

  onSearch(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    if (this.searchQuery.trim()) {
      // Arama geçmişine ekle
      this.apiService.addToSearchHistory(this.searchQuery);
      this.searchHistory = this.apiService.getSearchHistory();

      // Sonuç sayfasına yönlendir
      this.router.navigate(['/arama'], {
        queryParams: { query: this.searchQuery }
      });

      // Modal veya dropdown'ları kapat
      this.showResults = false;
      this.showHistory = false;
    }
  }

  onInput(): void {
    if (this.searchQuery.trim()) {
      this.isLoading = true;
      this.showHistory = false;
      this.apiService.search(this.searchQuery);
    } else {
      this.searchResults = [];
      this.showResults = false;
      this.showHistory = this.searchHistory.length > 0;
    }
  }

  selectResult(item: any): void {
    const type = item.media_type === 'movie' ? 'film' : 'dizi';
    this.router.navigate(['/detay', type, item.id]);

    // Arama geçmişine ekle
    this.apiService.addToSearchHistory(item.title || item.name);
    this.searchHistory = this.apiService.getSearchHistory();

    // Temizle
    this.clearSearch();
  }

  selectHistoryItem(term: string): void {
    this.searchQuery = term;
    this.onSearch();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.showResults = false;
    this.showHistory = false;
    this.searchResults = [];
  }

  clearHistory(): void {
    this.apiService.clearSearchHistory();
    this.searchHistory = [];
    this.showHistory = false;
  }

  // Klavye navigasyonu için
  handleKeyDown(event: KeyboardEvent): void {
    if (this.showResults && this.searchResults.length > 0) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, this.searchResults.length - 1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
      } else if (event.key === 'Enter' && this.selectedIndex > -1) {
        event.preventDefault();
        this.selectResult(this.searchResults[this.selectedIndex]);
      }
    } else if (this.showHistory && this.searchHistory.length > 0) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, this.searchHistory.length - 1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
      } else if (event.key === 'Enter' && this.selectedIndex > -1) {
        event.preventDefault();
        this.selectHistoryItem(this.searchHistory[this.selectedIndex]);
      }
    }
  }

  getFallbackImage(mediaType: string): string {
    return mediaType === 'movie' ? 'assets/movie-placeholder.jpg' : 'assets/tv-placeholder.jpg';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
