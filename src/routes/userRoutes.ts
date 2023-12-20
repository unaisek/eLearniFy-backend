import { Router } from 'express';
import CourseController from '../controllers/courseController';

const router = Router();
const courseController = new CourseController;

router.get('/all-courses',courseController.getAllCoursesForStudent.bind(courseController));
router.get('/course-overView/:id',courseController.getCourseDetails.bind(courseController))

export default router;