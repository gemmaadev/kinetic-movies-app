import type { Person } from "../explore/explore.types.js";
import type { Movie } from "../movie/movie.types.js";

export interface MovieCredit extends Movie {
  job?: string;
  character?: string;
}

export interface PersonDetail extends Person {
  biography: string;
  birthday: string | null;
  placeOfBirth: string | null;
  filmography: MovieCredit[];
  filmographyAsDirector: MovieCredit[];
}

export interface TmdbPersonDetailRaw {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  movie_credits: {
    cast: TmdbMovieCreditRaw[];
    crew: TmdbMovieCreditRaw[];
  };
}

export interface TmdbMovieCreditRaw {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  job?: string;
  character?: string;
}
