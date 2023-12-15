import { log } from "console";
import { Request,Response,NextFunction } from "express";
import CourseService from "../services/CourseService";

export default class CourseController {
  private _courseService: CourseService;

  constructor() {
    this._courseService = new CourseService();
  }
  async addNewCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const courseData = await this._courseService.addNewCourse(req);
      const courseTitle: string | undefined = courseData?.title;
      const order = (courseData?.chapters?.length || 0) + 1;
      const courseId = courseData?._id;
      await this._courseService.createChapter(
        req,
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

  async updateCourse(req:Request,res:Response, next: NextFunction){

    try {

         const courseId = req.params.id;
         const courseData = req.body;
         const files = req.files as Express.Multer.File[];

         const updatedData = await this._courseService.updateCourse(
           courseId,
           courseData,
           files
         );
         if (updatedData) {
            res.json(200).json(updatedData)
         } else {
            res.json(401).json({message:"Course Not Found"})
         }
        
    } catch (error) {
        next(error)
    }
      
  }
}