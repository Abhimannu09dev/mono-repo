import { Router } from "express";
import {
  generateShareLink,
  viewSharedFile,
  revokeShareLink,
} from "../controllers/fileShareController";
import { protect } from "../middlewares/auth.middleware";
import { validateShareToken } from "../middlewares/share.middleware";

const router = Router();

router.post("/:fileId/generate", protect, generateShareLink);
router.delete("/:fileId/revoke", protect, revokeShareLink);

router.get("/:token", validateShareToken, viewSharedFile);

export default router;
