import { Router } from "express";
import {
  getPopular,
  getNowPlaying,
  getTrending,
  getTopRated,
  getUpcoming,
  getMovieDetail,
} from "./controller/movie.controller.js";
import { verifyFirebaseToken } from "../../middleware/verifyFirebaseToken.js";
import {
  getFavoriteMovies,
  toggleFavorite,
  rateMovie,
} from "./controller/movie.favorites.controller.js";
import { getMyRankedMovies } from "./controller/movie-stats.controller.js";

const router = Router();

router.get("/favorites", verifyFirebaseToken, getFavoriteMovies);
router.post("/favorites", verifyFirebaseToken, toggleFavorite);
router.patch("/rating", verifyFirebaseToken, rateMovie);
router.get("/stats/mine", verifyFirebaseToken, getMyRankedMovies);

router.get("/", verifyFirebaseToken, getPopular);
router.get("/now-playing", verifyFirebaseToken, getNowPlaying);
router.get("/trending", verifyFirebaseToken, getTrending);
router.get("/top-rated", verifyFirebaseToken, getTopRated);
router.get("/upcoming", verifyFirebaseToken, getUpcoming);
router.get("/:id", verifyFirebaseToken, getMovieDetail);

export default router;
