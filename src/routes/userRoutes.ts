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


export default router;