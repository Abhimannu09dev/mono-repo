import { Router } from "express";
import { uploadFile } from "../controllers/fileController";
import { protect } from "../middlewares/auth.middleware";
import { upload } from "../utils/multer";

const router = Router();

router.use(protect);

router.post("/", upload.single("file"), uploadFile);

export default router;
