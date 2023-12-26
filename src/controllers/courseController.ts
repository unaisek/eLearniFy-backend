import { log } from "console";
import { Request,Response,NextFunction } from "express";
import CourseService from "../services/CourseService";
import dotenv from 'dotenv'
dotenv.config()


export default class CourseController {
  private _courseService: CourseService;

  constructor() {
    this._courseService = new CourseService();
  }
  async addNewCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const courseData = await this._courseService.addNewCourse(req);
      const courseTitle: string | undefined = courseData?.title;
      const { chapterTitle, chapterDescription } = req.body;
      const order = (courseData?.chapters?.length || 0) + 1;
      const courseId = courseData?._id;
      const chapterData = { chapterTitle, chapterDescription };

      const files = req.files as Express.Multer.File[];
      await this._courseService.createChapter(
        chapterData,
        files,
        order,
        courseTitle,
        courseId
      );
      res.status(200).json(courseData);
    } catch (error) {
      next(error);
    }
  }

  async getAllCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const tutorId = req.params.id;
      const courses = await this._courseService.getAllCourses(tutorId);

      res.status(200).json(courses);
    } catch (error) {
      next(error);
    }
  }

  async getCourseDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = req.params.id;

      const courseData = await this._courseService.getCourseDetails(courseId);

      if (courseData) {
        res.status(200).json(courseData);
      }
    } catch (error) {
      next(error);
    }
  }

  async updateCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = req.params.id;
      const courseData = req.body;
      console.log(courseData);

      const files = req.files as Express.Multer.File[];

      const updatedData = await this._courseService.updateCourse(
        courseId,
        courseData,
        files
      );
      if (updatedData) {
        res.json(200).json(updatedData);
      }
    } catch (error) {
      next(error);
    }
  }

  async updateChapter(req: Request, res: Response, next: NextFunction) {
    try {
      const chapterId = req.params.chapterId;
      const chapterData = req.body;
      const files = req.files as Express.Multer.File[];
      const { courseTitle } = req.body;

      const updateChapter = await this._courseService.updateChapter(
        chapterId,
        chapterData,
        files,
        courseTitle
      );
      if (updateChapter) {
        res.status(200).json(updateChapter);
      }
    } catch (error) {
      next(error);
    }
  }

  //   add more chapter to course
  async addNewChapterToCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const chapterData = req.body;
      console.log(chapterData, "controller data");
      const courseId = req.params.courseId;
      console.log(courseId, "controller id");

      const files = req.files as Express.Multer.File[];
      const { courseTitle } = req.body;

      const courseData = await this._courseService.getCourseDetails(courseId);
      const order = (courseData?.chapters?.length || 0) + 1;
      const data = await this._courseService.createChapter(
        chapterData,
        files,
        order,
        courseTitle,
        courseId
      );
      if (data) {
        res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  //   fetching all courses for students

  async getAllCoursesForStudent(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const courseLists = await this._courseService.getAllCourseForStudents();
      res.status(200).json(courseLists);
    } catch (error) {
      next(error);
    }
  }

  // stripe Payment

  async coursePayment(req: Request, res:Response, next:NextFunction){
    try {

      const { courseId } = req.body
      const sessionUrl=await this._courseService.createCheckoutSession(courseId);
      // console.log(sessionId,"sessionsId");
      
      res.status(200).json(sessionUrl)

      
      
    } catch (error) {
      next(error)
    }
  }
}