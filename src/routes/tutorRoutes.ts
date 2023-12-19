import { Router } from "express";
import { upload } from "../middlewares/multer"
import CategoryController from "../controllers/categoryController";
import CourseController from "../controllers/courseController";

const router = Router();
const catergoryController = new CategoryController();
const courseController = new CourseController()

router.get('/category',catergoryController.getAllCategory.bind(catergoryController));
router.post('/add-course',upload.any(),courseController.addNewCourse.bind(courseController));
router.get('/all-courses/:id',courseController.getAllCourses.bind(courseController));
router.get('/view-course/:id',courseController.getCourseDetails.bind(courseController))
router.put('/update-course/:id',upload.any(),courseController.updateCourse.bind(courseController));
router.put('/update-chapter/:chapterId', upload.any(),courseController.updateChapter.bind(courseController));
router.post('/add-chapter/:courseId',upload.any(),courseController.addNewChapterToCourse.bind(courseController))



export default router;