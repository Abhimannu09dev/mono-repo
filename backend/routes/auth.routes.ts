import { Router } from "express";
import { createUser, loginUser } from "../controllers/userController";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, signupSchema } from "../validations/auth.validation";

const router = Router();

router.post("/signup", validate(signupSchema), createUser);
router.post("/login", validate(loginSchema), loginUser);

export default router;
