import "dotenv/config";
import express from "express";
import cors from "cors";
import exploreRoutes from "./features/explore/explore.routes.js";
import movieRoutes from "./features/movie/movie.routes.js";
import personRoutes from "./features/person/person.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/explore", exploreRoutes);
app.use("/api/movie", movieRoutes);
app.use("/api/person", personRoutes);

export default app;
