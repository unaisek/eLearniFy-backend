import { Router } from "express";
import AuthController from "../controllers/authController";

const router= Router();
const authController = new AuthController();

router.post('/register',authController.postRegister.bind(authController));

export default router;