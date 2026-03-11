import { Router } from "express";
import {
  uploadFile,
  getMyFiles,
} from "../controllers/fileController";
import { protect } from "../middlewares/auth.middleware";
import { upload } from "../utils/multer";

const router = Router();

router.use(protect);

router.post("/", upload.single("file"), uploadFile);
router.get("/", getMyFiles);

export default router;
