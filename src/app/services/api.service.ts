import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {debounceTime, distinctUntilChanged, map, Observable, of, Subject, switchMap} from 'rxjs';
import { environment } from '../../environments/environment';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiKey = environment.apiKey;
  private baseUrl = environment.apiUrl;
  private searchHistoryKey = 'search_history';
  private searchTerms = new Subject<string>();

  searchResults$ = this.searchTerms.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term => {
      if (!term.trim()) {
        return of({ results: [] });
      }
      return this.searchMulti(term);
    }),
    catchError(error => {
      console.error('Search error:', error);
      return of({ results: [] });
    })
  );

  constructor(private http: HttpClient) { }

  getPopularMovies(page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=tr-TR&page=${page}`);
  }

  getPopularTvShows(page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/tv/popular?api_key=${this.apiKey}&language=tr-TR&page=${page}`);
  }

  getMovieDetails(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/${id}?api_key=${this.apiKey}&language=tr-TR`);
  }

  getTvDetails(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/tv/${id}?api_key=${this.apiKey}&language=tr-TR`);
  }

  // Yeni eklenen fonksiyonlar
  getMovieCredits(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/${id}/credits?api_key=${this.apiKey}&language=tr-TR`);
  }

  getTvCredits(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/tv/${id}/credits?api_key=${this.apiKey}&language=tr-TR`);
  }

  getMovieVideos(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/${id}/videos?api_key=${this.apiKey}&language=tr-TR`);
  }

  getTvVideos(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/tv/${id}/videos?api_key=${this.apiKey}&language=tr-TR`);
  }

  getSimilarMovies(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/${id}/similar?api_key=${this.apiKey}&language=tr-TR&page=1`);
  }

  getSimilarTvShows(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/tv/${id}/similar?api_key=${this.apiKey}&language=tr-TR&page=1`);
  }

  getMovieReviews(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/${id}/reviews?api_key=${this.apiKey}&language=en-US&page=1`);
  }

  getTvReviews(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/tv/${id}/reviews?api_key=${this.apiKey}&language=en-US&page=1`);
  }

  getTvSeasons(id: number, season_number: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/tv/${id}/season/${season_number}?api_key=${this.apiKey}&language=tr-TR`);
  }

  searchContent(query: string, page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/search/multi?api_key=${this.apiKey}&language=tr-TR&query=${query}&page=${page}`);
  }

  getMovieGenres(): Observable<any> {
    return this.http.get(`${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}&language=tr-TR`);
  }

  getTvGenres(): Observable<any> {
    return this.http.get(`${this.baseUrl}/genre/tv/list?api_key=${this.apiKey}&language=tr-TR`);
  }

  getMoviesByGenre(genreId: number, page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/discover/movie?api_key=${this.apiKey}&language=tr-TR&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`);
  }

  getTvShowsByGenre(genreId: number, page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/discover/tv?api_key=${this.apiKey}&language=tr-TR&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`);
  }
  getPersonDetails(personId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/person/${personId}?api_key=${this.apiKey}&language=tr-TR`);
  }

  getPersonCredits(personId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/person/${personId}/combined_credits?api_key=${this.apiKey}&language=tr-TR`);
  }

  getPersonImages(personId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/person/${personId}/images?api_key=${this.apiKey}`);
  }

  // Anlık arama için
  search(term: string): void {
    this.searchTerms.next(term);
  }

  // Çoklu arama (film + dizi)
  searchMulti(query: string, page: number = 1): Observable<any> {
    const url = `${this.baseUrl}/search/multi?api_key=${this.apiKey}&language=tr-TR&query=${encodeURIComponent(query)}&page=${page}`;
    return this.http.get<any>(url).pipe(
      map(response => {
        // Sadece film ve dizi sonuçlarını filtrele
        if (page === 1) { // Anlık arama önerileri için sadece ilk 8
          response.results = response.results
            .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
            .slice(0, 8);
        } else { // Tam arama sonuçları için tüm sayfa
          response.results = response.results
            .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv');
        }
        return response;
      })
    );
  }

  // Arama geçmişi yönetimi
  addToSearchHistory(term: string): void {
    if (!term.trim()) return;

    const history = this.getSearchHistory();
    // Varsa mevcut öğeyi çıkar
    const filteredHistory = history.filter(item => item.toLowerCase() !== term.toLowerCase());
    // Başa ekle (max 10 öğe)
    const newHistory = [term, ...filteredHistory].slice(0, 10);

    localStorage.setItem(this.searchHistoryKey, JSON.stringify(newHistory));
  }

  getSearchHistory(): string[] {
    try {
      const history = localStorage.getItem(this.searchHistoryKey);
      return history ? JSON.parse(history) : [];
    } catch (e) {
      console.error('Error parsing search history:', e);
      return [];
    }
  }

  clearSearchHistory(): void {
    localStorage.removeItem(this.searchHistoryKey);
  }

  // Yardımcı metod
  getMediaTypeLabel(type: string): string {
    return type === 'movie' ? 'Film' : 'Dizi';
  }


}
