import { Router } from 'express';
import { upload } from '../middlewares/multer';
import CourseController from '../controllers/courseController';
import UserController from '../controllers/userController';

const router = Router();
const courseController = new CourseController;
const userConstroller = new UserController;

router.get('/all-courses',courseController.getAllCoursesForStudent.bind(courseController));
router.get('/course-overView/:id',courseController.getCourseDetails.bind(courseController));
router.post('/create-checkout-session',courseController.coursePayment.bind(courseController));
router.post("/enroll-course",courseController.enrollCourse.bind(courseController));
router.get('/profile/:id',userConstroller.getUserData.bind(userConstroller));
router.post('/upload-profile',upload.any(),userConstroller.uploadProfileImage.bind(userConstroller));
router.get('/my-courses/:userId',courseController.getEnrolledCoursesByUser.bind(courseController));
router.post('/cancel-course',courseController.cancelEnrolledCourse.bind(courseController));
router.get('/wallet/:userId',userConstroller.getWalletData.bind(userConstroller));
router.get('/enrolled-course',courseController.getEnrolledCourseData.bind(courseController));
router.put('/update-progression',courseController.updateCourseProgression.bind(courseController))


export default router;