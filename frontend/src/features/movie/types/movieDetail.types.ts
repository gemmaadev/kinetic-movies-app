export interface Genre {
  id: number;
  name: string;
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

export interface MovieDetail {
  id: number;
  title: string;
  posterUrl: string | null;
  voteAverage: number;
  releaseYear: number | null;
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
  isFavourite: boolean;
  userRating: number | null;
}
