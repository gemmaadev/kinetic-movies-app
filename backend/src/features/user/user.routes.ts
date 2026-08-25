import { Router } from "express";
import { getProfile, updateProfile } from "./user.controller.js";
import { verifyFirebaseToken } from "../../middleware/verifyFirebaseToken.js";

const router = Router();

router.get("/profile", verifyFirebaseToken, getProfile);
router.patch("/profile", verifyFirebaseToken, updateProfile);

export default router;
