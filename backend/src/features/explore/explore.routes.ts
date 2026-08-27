import { Router } from "express";
import { exploreController } from "./explore.controller.js";
import { verifyFirebaseToken } from "../../middleware/verifyFirebaseToken.js";

const router = Router();

router.get("/", verifyFirebaseToken, exploreController);

export default router;
