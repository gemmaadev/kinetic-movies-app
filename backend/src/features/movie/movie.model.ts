import prisma from "../../config/db.js";
import type { Movie } from "../../generated/prisma/client.js";

export type { Movie };

export async function addFavoriteMovie(data: {
  userId: string;
  movieId: number;
  rating: number;
  title: string;
  poster?: string;
}): Promise<Movie> {
  if (data.rating < 1 || data.rating > 10) {
    throw new Error("El rating tiene que estar entre 1 y 10");
  }
  return prisma.movie.create({ data });
}

export async function getFavoritesByUser(userId: string): Promise<Movie[]> {
  return prisma.movie.findMany({ where: { userId } });
}
