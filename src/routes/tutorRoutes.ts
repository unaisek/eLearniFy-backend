import { Router } from "express";
import { upload } from "../middlewares/multer"
import CategoryController from "../controllers/categoryController";
import CourseController from "../controllers/courseController";

const router = Router();
const catergoryController = new CategoryController();
const courseController = new CourseController()

router.get('/category',catergoryController.getAllCategory.bind(catergoryController));
router.post('/add-course',upload.any(),courseController.addNewCourse.bind(courseController))


export default router;