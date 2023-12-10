import { Router } from "express";
import AuthController from "../controllers/authController";

const router= Router();
const authController = new AuthController();

router.post('/register',authController.postRegister.bind(authController));
router.post("/resendOtp", authController.resendOtp.bind(authController));
router.post('/verification',authController.otpVerification.bind(authController));
router.post('/login', authController.userLogin.bind(authController));
router.post('/reverification', authController.userReverification.bind(authController));



export default router;