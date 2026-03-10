import { Router } from "express";
import {
  createFolder,
  deleteFolder,
  getFolders,
} from "../controllers/folderController";

const router = Router();

router.post("/folders", createFolder);
router.get("/folders", getFolders);
router.delete("/folders/:id", deleteFolder);

export default router;
