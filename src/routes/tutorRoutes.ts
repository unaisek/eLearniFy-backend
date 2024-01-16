import { Router } from "express";
import { upload } from "../middlewares/multer"
import CategoryController from "../controllers/categoryController";
import CourseController from "../controllers/courseController";
import UserController from "../controllers/userController";
import TutorController from "../controllers/tutorController";
import { isTutorAuth } from "../middlewares/authentication";

const router = Router();
const catergoryController = new CategoryController();
const courseController = new CourseController();
const userController = new UserController();
const tutorController = new TutorController()

router.get('/category',isTutorAuth, catergoryController.getAllCategory.bind(catergoryController));
router.post('/add-course',isTutorAuth, upload.any(),courseController.addNewCourse.bind(courseController));
router.get('/all-courses/:id',isTutorAuth, courseController.getAllCourses.bind(courseController));
router.get('/view-course/:id',isTutorAuth, courseController.getCourseDetails.bind(courseController))
router.put('/update-course/:id',isTutorAuth, upload.any(),courseController.updateCourse.bind(courseController));
router.put('/update-chapter/:chapterId',isTutorAuth,  upload.any(),courseController.updateChapter.bind(courseController));
router.post('/add-chapter/:courseId',isTutorAuth, upload.any(),courseController.addNewChapterToCourse.bind(courseController));
router.get("/profile/:id",isTutorAuth,  userController.getUserData.bind(userController));
router.put('/upload-profile',isTutorAuth, upload.any(),userController.uploadProfileImage.bind(userController));
router.put('/unlist-course/:courseId',isTutorAuth, courseController.unlistCourse.bind(courseController));
router.put('/list-course/:courseId',isTutorAuth, courseController.listCourse.bind(courseController));
router.put("/delete-chapter",isTutorAuth, courseController.deleteChapter.bind(courseController));
router.get('/wallet/:userId',isTutorAuth, userController.getWalletData.bind(userController));
router.get('/dashboard/:tutorId',isTutorAuth, tutorController.getDashboardValues.bind(tutorController))

export default router;