import { Router } from 'express';
import { upload } from '../middlewares/multer';
import CourseController from '../controllers/courseController';
import UserController from '../controllers/userController';
import { isStudentAuth } from '../middlewares/authentication';

const router = Router();
const courseController = new CourseController;
const userConstroller = new UserController;

router.get('/all-courses',courseController.getAllCoursesForStudent.bind(courseController));
router.get('/course-overView/:id',courseController.getCourseDetails.bind(courseController));
router.post('/create-checkout-session',isStudentAuth ,courseController.coursePayment.bind(courseController));
router.post("/enroll-course", isStudentAuth, courseController.enrollCourse.bind(courseController));
router.get('/profile/:id', isStudentAuth, userConstroller.getUserData.bind(userConstroller));
router.post('/upload-profile',isStudentAuth,upload.any(),userConstroller.uploadProfileImage.bind(userConstroller));
router.get('/my-courses/:userId', isStudentAuth, courseController.getEnrolledCoursesByUser.bind(courseController));
router.post('/cancel-course', isStudentAuth, courseController.cancelEnrolledCourse.bind(courseController));
router.get('/wallet/:userId',isStudentAuth, userConstroller.getWalletData.bind(userConstroller));
router.get('/enrolled-course',isStudentAuth, courseController.getEnrolledCourseData.bind(courseController));
router.put('/update-progression', isStudentAuth, courseController.updateCourseProgression.bind(courseController));

router.post('/add-review', isStudentAuth, courseController.addReviewForCourse.bind(courseController));
router.get('/review/:courseId', isStudentAuth, courseController.getAllReviewsOfCourse.bind(courseController));
// router.post('/add-rating',courseController.addRatingForCourse.bind(courseController))


export default router;