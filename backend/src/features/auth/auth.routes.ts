import { Router } from "express";
import {
  createUserRecord,
  syncUserOnLogin,
  deleteUserRecord,
} from "./auth.controller.js";
import { verifyFirebaseToken } from "../../middleware/verifyFirebaseToken.js";

const router = Router();

router.post("/register", verifyFirebaseToken, createUserRecord);
router.post("/login", verifyFirebaseToken, syncUserOnLogin);
router.delete("/user", verifyFirebaseToken, deleteUserRecord);

export default router;
