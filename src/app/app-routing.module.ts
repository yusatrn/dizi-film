import { Routes } from '@angular/router';
import {RandomComponent} from './components/random/random.component';
import {PersonDetailsComponent} from './components/person-details/person-details.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(c => c.HomeComponent)
  },
  {
    path: 'filmler',
    loadComponent: () => import('./components/movie-list/movie-list.component').then(c => c.MovieListComponent)
  },
  {
    path: 'diziler',
    loadComponent: () => import('./components/tv-list/tv-list.component').then(c => c.TvListComponent)
  },
  {
    path: 'detay/:type/:id',
    loadComponent: () => import('./components/details/details.component').then(c => c.DetailsComponent)
  },
  {
    path: 'arama',
    loadComponent: () => import('./components/search/search.component').then(c => c.SearchComponent)
  },

  { path: 'oyuncu/:id', component: PersonDetailsComponent },

  { path: 'rastgele', component: RandomComponent

  },


  {
    path: '**',
    redirectTo: ''
  }
];
