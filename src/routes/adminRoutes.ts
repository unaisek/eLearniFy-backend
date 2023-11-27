import { Router } from "express";
import AuthController from "../controllers/authController";
import CategoryController from "../controllers/categoryController";
import UserController from "../controllers/userController";

const adminRouter = Router();
const authController = new AuthController();
const categoryController = new CategoryController();
const userController = new UserController(); 

// admin authentication
adminRouter.post('/login',authController.adminLoginPost.bind(authController));

// category managment
adminRouter.get('/categories',categoryController.getAllCategory.bind(categoryController))
adminRouter.post('/add-category',categoryController.addCategory.bind(categoryController));

// users managment

adminRouter.get('/users-list', userController.getAllUsers.bind(userController));
adminRouter.put('/user-block/:id', userController.blockUser.bind(userController));
adminRouter.put("/user-unblock/:id", userController.UnBlockUser.bind(userController));


export default adminRouter;
