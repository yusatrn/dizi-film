import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ApiService } from '../../services/api.service';
import { forkJoin } from 'rxjs';
import {DatePipe, Location, NgForOf, NgIf} from '@angular/common';

interface PersonCredit {
  id: number;
  media_type: string;
  title?: string;
  name?: string;
  character?: string;
  popularity: number;
  vote_count: number;
  poster_path?: string;
  release_date?: string;
  first_air_date?: string;
}

@Component({
  selector: 'app-person-details',
  standalone: true,
  imports: [
    DatePipe,
    NgIf,
    NgForOf
  ],
  templateUrl: './person-details.component.html',
  styleUrl: './person-details.component.scss'
})
export class PersonDetailsComponent implements OnInit {
  personId: number = 0; // Default değer atandı
  personDetails: any = null;
  personCredits: {cast?: PersonCredit[]} = {};
  personImages: any = null;
  loading: boolean = true;
  error: boolean = false;
  imageBaseUrl: string = 'https://image.tmdb.org/t/p/';
  activeTab: string = 'biography'; // Default active tab
  imdbLink: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private titleService: Title,
    private location: Location
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.personId = +idParam;
      this.loadPersonData();
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  loadPersonData(): void {
    this.loading = true;
    this.error = false;

    // Use forkJoin to make multiple API calls in parallel
    const personDetails$ = this.apiService.getPersonDetails(this.personId);
    const personCredits$ = this.apiService.getPersonCredits(this.personId);
    const personImages$ = this.apiService.getPersonImages(this.personId);

    forkJoin({
      details: personDetails$,
      credits: personCredits$,
      images: personImages$
    }).subscribe({
      next: (response) => {
        this.personDetails = response.details;
        this.personCredits = response.credits;
        this.personImages = response.images;

        // Set the page title
        this.titleService.setTitle(`${this.personDetails.name} | Oyuncu Bilgisi`);

        // Set IMDb link if available
        if (this.personDetails.imdb_id) {
          this.imdbLink = `https://www.imdb.com/name/${this.personDetails.imdb_id}`;
        }

        // Sort credits by popularity
        if (this.personCredits && this.personCredits.cast) {
          this.personCredits.cast.sort((a: PersonCredit, b: PersonCredit) => b.popularity - a.popularity);
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading person data:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
  }

  calculateAge(birthdate: string, deathdate: string | undefined = undefined): number | undefined {
    if (!birthdate) return undefined;

    const birth = new Date(birthdate);
    const end = deathdate ? new Date(deathdate) : new Date();

    let age = end.getFullYear() - birth.getFullYear();
    const m = end.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && end.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return 'Belirtilmemiş';
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  navigateToDetails(mediaType: string, id: number): void {
    const type = mediaType === 'movie' ? 'film' : 'dizi';
    this.router.navigate(['/detay', type, id]);
  }

  getKnownForCredits(): PersonCredit[] {
    if (!this.personCredits || !this.personCredits.cast) return [];
    return this.personCredits.cast
      .filter((credit: PersonCredit) => credit.popularity > 5 || credit.vote_count > 100)
      .slice(0, 6);
  }

  getMovieCredits(): PersonCredit[] {
    if (!this.personCredits || !this.personCredits.cast) return [];
    return this.personCredits.cast.filter((credit: PersonCredit) => credit.media_type === 'movie');
  }

  getTVCredits(): PersonCredit[] {
    if (!this.personCredits || !this.personCredits.cast) return [];
    return this.personCredits.cast.filter((credit: PersonCredit) => credit.media_type === 'tv');
  }
}
