import { Router } from "express";
import {
  createFolder,
  deleteFolder,
  getFolders,
} from "../controllers/folderController";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/create", protect, createFolder);
router.get("/get", protect, getFolders);
router.delete("/delete/:id", protect, deleteFolder);

export default router;
