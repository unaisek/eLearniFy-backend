import { Router } from "express";
import AuthController from "../controllers/authController";
import CategoryController from "../controllers/categoryController";
import UserController from "../controllers/userController";
import CouponController from "../controllers/couponController";
import AdminController from "../controllers/adminController";
import { isAdminAuth } from "../middlewares/authentication";

const adminRouter = Router();
const authController = new AuthController();
const categoryController = new CategoryController();
const userController = new UserController(); 
const couponController = new CouponController();
const adminController = new AdminController()

// admin authentication
adminRouter.post('/login',authController.adminLoginPost.bind(authController));

// category managment
adminRouter.get('/categories',isAdminAuth, categoryController.getAllCategory.bind(categoryController))
adminRouter.post('/add-category',isAdminAuth, categoryController.addCategory.bind(categoryController));

// users managment

adminRouter.get('/users-list',isAdminAuth,  userController.getAllUsers.bind(userController));
adminRouter.patch('/user-block',isAdminAuth,  userController.blockUser.bind(userController));
adminRouter.patch("/user-unblock",isAdminAuth,  userController.UnBlockUser.bind(userController));

// coupon Managment
adminRouter.post('/add-coupon',isAdminAuth,  couponController.addNewCoupon.bind(couponController));
adminRouter.get('/coupons',isAdminAuth,  couponController.getAllCoupons.bind(couponController));
adminRouter.put('/update-coupon',isAdminAuth, couponController.updateCoupon.bind(couponController));
adminRouter.put('/unlist-coupon',isAdminAuth, couponController.unlistCoupon.bind(couponController));
adminRouter.put("/list-coupon",isAdminAuth, couponController.listCoupon.bind(couponController));

adminRouter.get('/dashboard',isAdminAuth, adminController.getValuesForDashboard.bind(adminController))
adminRouter.get("/enrolled-courses/:year",isAdminAuth ,adminController.getAllEnrolledCourses.bind(adminController));


export default adminRouter;
