import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
  import { Router, RouterLink, RouterLinkActive } from '@angular/router';
  import { FormsModule } from '@angular/forms';
  import { CommonModule } from '@angular/common';
  import { ContentService } from '../../services/content.service';
  import { debounceTime, distinctUntilChanged, Subject, finalize } from 'rxjs';
import {SearchComponent} from '../search/search.component';

  @Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [RouterLink, RouterLinkActive, FormsModule, CommonModule, SearchComponent]
  })
  export class HeaderComponent {
    searchQuery: string = '';
    searchResults: any[] = [];
    isLoading: boolean = false;
    showResults: boolean = false;
    selectedIndex: number = -1;
    private searchSubject: Subject<string> = new Subject();
    @ViewChild('searchInput') searchInput!: ElementRef;
    imageBaseUrl: string = 'https://image.tmdb.org/t/p/w92';

    constructor(private router: Router, private contentService: ContentService, private elementRef: ElementRef) {
      this.searchSubject.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(query => {
        if (query.trim().length > 1) {
          this.isLoading = true;
          this.contentService.searchContent(query)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe({
              next: (results) => {
                this.searchResults = results.results.slice(0, 5); // Limit to 5 results
                this.showResults = this.searchResults.length > 0;
                this.selectedIndex = -1;
              },
              error: (error) => {
                console.error('Search error:', error);
                this.searchResults = [];
                this.showResults = false;
              }
            });
        } else {
          this.searchResults = [];
          this.showResults = false;
        }
      });
    }

    onSearch(): void {
      if (this.searchQuery.trim()) {
        this.router.navigate(['/arama'], { queryParams: { q: this.searchQuery } });
        this.showResults = false;
      }
    }

    onSearchInput(): void {
      this.searchSubject.next(this.searchQuery);
    }

    selectResult(result: any): void {
      const type = result.media_type === 'movie' ? 'film' : 'dizi';
      this.router.navigate(['/detay', type, result.id]);
      this.searchQuery = '';
      this.showResults = false;
      this.searchResults = [];
    }

    @HostListener('document:click', ['$event'])
    clickOutside(event: Event): void {
      if (!this.elementRef.nativeElement.contains(event.target)) {
        this.showResults = false;
      }
    }

    @HostListener('keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent): void {
      if (!this.showResults) return;

      switch(event.key) {
        case 'ArrowDown':
          event.preventDefault();
          this.selectedIndex = Math.min(this.selectedIndex + 1, this.searchResults.length - 1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
          break;
        case 'Enter':
          if (this.selectedIndex >= 0) {
            event.preventDefault();
            this.selectResult(this.searchResults[this.selectedIndex]);
          }
          break;
        case 'Escape':
          this.showResults = false;
          break;
      }
    }

    getResultTitle(result: any): string {
      return result.media_type === 'movie' ? result.title : result.name;
    }
  }
