import { Router } from "express";
import { registerClient, loginClient, registerUser, loginUser, loginGuest, googleSignIn, googleLogin, appleSignIn, appleLogin } from "../controller/auth.controller.js";

const router = Router();

router.post("/register", registerClient);
router.post("/login", loginClient);
//router.get("/logout", logout);
router.post("/registerUser", registerUser);
router.post("/loginUser", loginUser);
router.post("/loginguest", loginGuest);
router.post("/googleSignIn", googleSignIn);
router.post("/googleLogin", googleLogin);
router.post("/appleSignIn", appleSignIn);
router.post("/appleLogIn", appleLogin);
export default router