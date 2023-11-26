import { Router } from "express";
import AuthController from "../controllers/authController";
import CategoryController from "../controllers/categoryController";

const adminRouter = Router();
const authController = new AuthController();
const categoryController = new CategoryController() 

adminRouter.post('/login',authController.adminLoginPost.bind(authController));
adminRouter.get('/categories',categoryController.getAllCategory.bind(categoryController))
adminRouter.post('/add-category',categoryController.addCategory.bind(categoryController));


export default adminRouter;
