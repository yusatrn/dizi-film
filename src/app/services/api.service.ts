import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiKey = environment.apiKey;
  private baseUrl = environment.apiUrl;

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

}
