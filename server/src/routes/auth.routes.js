import { Router } from "express";
import { registerClient, loginClient, changeClientPassword, registerUser, loginUser, verifyResetCode, loginGuest, googleSignIn, googleLogin, appleSignIn, appleLogin, requestResetCode } from "../controller/auth.controller.js";

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
router.post('/request-reset', requestResetCode)
router.post('/verify-code', verifyResetCode)
router.post('/reset-password', changeClientPassword)
export default router