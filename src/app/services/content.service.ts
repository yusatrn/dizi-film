import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie';
import { TvShow } from '../models/tv-show';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(private apiService: ApiService) { }

  getPopularMovies(page: number = 1): Observable<any> {
    return this.apiService.getPopularMovies(page);
  }

  getPopularTvShows(page: number = 1): Observable<any> {
    return this.apiService.getPopularTvShows(page);
  }

  getMovieDetails(id: number): Observable<Movie> {
    return this.apiService.getMovieDetails(id);
  }

  getTvShowDetails(id: number): Observable<TvShow> {
    return this.apiService.getTvDetails(id);
  }

  getMovieCredits(id: number): Observable<any> {
    return this.apiService.getMovieCredits(id);
  }

  getTvCredits(id: number): Observable<any> {
    return this.apiService.getTvCredits(id);
  }

  getMovieVideos(id: number): Observable<any> {
    return this.apiService.getMovieVideos(id);
  }

  getTvVideos(id: number): Observable<any> {
    return this.apiService.getTvVideos(id);
  }

  getSimilarMovies(id: number): Observable<any> {
    return this.apiService.getSimilarMovies(id);
  }

  getSimilarTvShows(id: number): Observable<any> {
    return this.apiService.getSimilarTvShows(id);
  }

  getMovieReviews(id: number): Observable<any> {
    return this.apiService.getMovieReviews(id);
  }

  getTvReviews(id: number): Observable<any> {
    return this.apiService.getTvReviews(id);
  }

  getTvSeasons(id: number, season_number: number): Observable<any> {
    return this.apiService.getTvSeasons(id, season_number);
  }

  searchContent(query: string, page: number = 1): Observable<any> {
    return this.apiService.searchContent(query, page);
  }

  getMovieGenres(): Observable<any> {
    return this.apiService.getMovieGenres();
  }

  getTvGenres(): Observable<any> {
    return this.apiService.getTvGenres();
  }

  getMoviesByGenre(genreId: number, page: number = 1): Observable<any> {
    return this.apiService.getMoviesByGenre(genreId, page);
  }

  getTvShowsByGenre(genreId: number, page: number = 1): Observable<any> {
    return this.apiService.getTvShowsByGenre(genreId, page);
  }
}
