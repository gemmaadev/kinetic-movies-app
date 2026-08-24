export interface Movie {
  id: number;
  title: string;
  posterUrl: string | null;
  voteAverage: number;
  releaseYear: number | null;
}

export interface MovieCredit extends Movie {
  job?: string;
  character?: string;
}

export interface Person {
  id: number;
  name: string;
  photoUrl: string | null;
  biography: string;
  birthday: string | null;
  placeOfBirth: string | null;
  filmography: MovieCredit[];
  filmographyAsDirector: MovieCredit[];
}
