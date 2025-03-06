export interface TvShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  vote_count: number;
  first_air_date: string;
  genres: Genre[];

  // Additional properties needed for details view
  number_of_seasons?: number;
  number_of_episodes?: number;
  tagline?: string;
  status?: string;
  original_language?: string;
  production_companies?: ProductionCompany[];
  seasons?: Season[];
  created_by?: Creator[];
  episode_run_time?: number[];
  homepage?: string;
  in_production?: boolean;
  languages?: string[];
  last_air_date?: string;
  networks?: Network[];
  origin_country?: string[];
  original_name?: string;
  popularity?: number;
  spoken_languages?: Language[];
  production_countries?: ProductionCountry[];
  type?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
}

export interface Creator {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string | null;
}

export interface Network {
  name: string;
  id: number;
  logo_path: string | null;
  origin_country: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface Language {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}
