import { Router } from "express";
import {
  createFolder,
  deleteFolder,
  getFolders,
} from "../controllers/folderController";

const router = Router();

router.post("/create", createFolder);
router.get("/get", getFolders);
router.delete("/delete/:id", deleteFolder);

export default router;
