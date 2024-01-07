import { Router } from "express";
import AuthController from "../controllers/authController";
import CategoryController from "../controllers/categoryController";
import UserController from "../controllers/userController";
import CouponController from "../controllers/couponController";

const adminRouter = Router();
const authController = new AuthController();
const categoryController = new CategoryController();
const userController = new UserController(); 
const couponController = new CouponController();

// admin authentication
adminRouter.post('/login',authController.adminLoginPost.bind(authController));

// category managment
adminRouter.get('/categories',categoryController.getAllCategory.bind(categoryController))
adminRouter.post('/add-category',categoryController.addCategory.bind(categoryController));

// users managment

adminRouter.get('/users-list', userController.getAllUsers.bind(userController));
adminRouter.put('/user-block/:id', userController.blockUser.bind(userController));
adminRouter.put("/user-unblock/:id", userController.UnBlockUser.bind(userController));

adminRouter.post('/add-coupon', couponController.addNewCoupon.bind(couponController));
adminRouter.get('/coupons', couponController.getAllCoupons.bind(couponController));
adminRouter.put('/update-coupon',couponController.updateCoupon.bind(couponController));
adminRouter.put('/unlist-coupon',couponController.unlistCoupon.bind(couponController));
adminRouter.put("/list-coupon",couponController.listCoupon.bind(couponController));


export default adminRouter;
