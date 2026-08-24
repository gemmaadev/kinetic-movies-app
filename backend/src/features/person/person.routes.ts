import { Router } from "express";
import { getPersonDetail } from "./person.controller.js";
import { verifyFirebaseToken } from "../../middleware/verifyFirebaseToken.js";

const router = Router();

router.get("/:id", verifyFirebaseToken, getPersonDetail);

export default router;
