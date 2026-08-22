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

const router = Router();

router.get("/", verifyFirebaseToken, getPopular);
router.get("/now-playing", verifyFirebaseToken, getNowPlaying);
router.get("/trending", verifyFirebaseToken, getTrending);
router.get("/top-rated", verifyFirebaseToken, getTopRated);
router.get("/upcoming", verifyFirebaseToken, getUpcoming);
router.get("/:id", verifyFirebaseToken, getMovieDetail);

export default router;
