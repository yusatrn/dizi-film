import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class SearchComponent implements OnInit {
  searchResults: any[] = [];
  searchQuery: string = '';
  imageBaseUrl: string = environment.imageBaseUrl;
  isLoading: boolean = true;
  error: string | null = null;
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(
    private contentService: ContentService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchQuery = params['q'];
        this.search();
      }
    });
  }

  search(): void {
    this.isLoading = true;
    this.error = null;

    this.contentService.searchContent(this.searchQuery, this.currentPage).subscribe({
      next: (data) => {
        this.searchResults = data.results.filter((item: any) => {
          return item.media_type === 'movie' || item.media_type === 'tv';
        });
        this.totalPages = data.total_pages;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Arama yapılırken bir hata oluştu';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  getTitle(item: any): string {
    return item.media_type === 'movie' ? item.title : item.name;
  }

  getReleaseDate(item: any): string {
    return item.media_type === 'movie' ? item.release_date : item.first_air_date;
  }

  getDetailUrl(item: any): string {
    const type = item.media_type === 'movie' ? 'film' : 'dizi';
    return `/detay/${type}/${item.id}`;
  }

  loadPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.search();
      window.scrollTo(0, 0);
    }
  }

  loadNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.search();
      window.scrollTo(0, 0);
    }
  }
}
