import { Router } from "express";
import { registerClient, loginClient, registerUser, loginUser, loginGuest } from "../controller/auth.controller.js";

const router = Router();

router.post("/register", registerClient);
router.post("/login", loginClient);
//router.get("/logout", logout);
router.post("/registerUser", registerUser);
router.post("/loginUser", loginUser);
router.post("/loginguest", loginGuest);
export default router