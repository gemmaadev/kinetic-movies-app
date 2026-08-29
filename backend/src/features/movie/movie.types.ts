export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  posterUrl: string | null;
  voteAverage: number;
  releaseYear: number | null;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  photoUrl: string | null;
}

export interface WatchProvider {
  providerId: number;
  providerName: string;
  logoUrl: string;
}

export interface DirectorInfo {
  id: number;
  name: string;
}
export interface MovieDetailFromTmdb extends Movie {
  overview: string;
  backdropUrl: string | null;
  runtime: number | null;
  genres: Genre[];
  tagline: string | null;
  cast: CastMember[];
  director: DirectorInfo | null;
  writers: string[];
  trailerUrl: string | null;
  watchProviders: WatchProvider[];
  watchProvidersLink: string | null;
}

export interface MovieDetail extends MovieDetailFromTmdb {
  isFavourite: boolean;
}

export interface TmdbMovieRaw {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
}

export interface TmdbGenreRaw {
  id: number;
  name: string;
}

export interface TmdbCastMemberRaw {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface TmdbCrewMemberRaw {
  id: number;
  name: string;
  job: string;
}

export interface TmdbVideoRaw {
  key: string;
  site: string;
  type: string;
}

export interface TmdbWatchProviderRaw {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface TmdbMovieDetailRaw extends TmdbMovieRaw {
  overview: string;
  backdrop_path: string | null;
  runtime: number | null;
  genres: TmdbGenreRaw[];
  tagline: string | null;
  credits: {
    cast: TmdbCastMemberRaw[];
    crew: TmdbCrewMemberRaw[];
  };
  videos: {
    results: TmdbVideoRaw[];
  };
  "watch/providers": {
    results: {
      ES?: {
        link?: string;
        flatrate?: TmdbWatchProviderRaw[];
      };
    };
  };
}
