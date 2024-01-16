import { Router } from "express";
import { methods as authController } from "../controller/auth.controller.js";

const router = Router();

router.post("/register", authController.registerClient);
router.post("/login", authController.loginClient);
//router.get("/logout", authController.logout);
router.post("/registerUser", authController.registerUser);
router.post("/loginUser", authController.loginUser);
export default router