export interface TmdbMovieRaw {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
}

export interface TmdbPersonRaw {
  id: number;
  name: string;
  known_for_department: string;
  profile_path: string | null;
}

export interface Movie {
  id: number;
  title: string;
  posterUrl: string | null;
  voteAverage: number;
  releaseYear: number | null;
}

export interface Person {
  id: number;
  name: string;
  photoUrl: string | null;
}
