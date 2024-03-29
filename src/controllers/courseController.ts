import { log } from "console";
import { Request,Response,NextFunction } from "express";
import CourseService from "../services/CourseService";
import dotenv from 'dotenv'
import { nextTick } from "process";
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

      const files = req.files as Express.Multer.File[];

      const updatedData = await this._courseService.updateCourse(
        courseId,
        courseData,
        files
      );
      if (updatedData) {
        res.status(200).json(updatedData);
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
      const courseId = req.params.courseId;

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

  async getCoursesForStudentHome(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await this._courseService.getCourseForStudentHome();
      res.status(200).json(courses)
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
      const {category, courseType, level, searchValue } = req.query;          
      const filter:Record<string, any> = {}
      if (category !== "all") {
        filter.category = category;
      }
      if (courseType !== "all") {
        filter.courseType = courseType;
      }
      if (level !== "all") {
        filter.level = level;
      } 
      if(searchValue !== " "){
        filter.searchValue = searchValue;
      }   
      
      const courseLists = await this._courseService.getAllCourseForStudents(filter);
      
      res.status(200).json(courseLists);
    } catch (error) {
      next(error);
    }
  }

  //  Payment

  async coursePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId, userId, couponId, paymentData } = req.body;

      const data = await this._courseService.createCheckoutSession(
        courseId,
        userId,
        couponId,
        paymentData
      );

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async unlistCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = req.params.courseId;
      const courseData = await this._courseService.unlistCourse(courseId);
      res.status(200).json(courseData);
    } catch (error) {
      next(error);
    }
  }

  async listCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = req.params.courseId;
      const courseData = await this._courseService.listCourse(courseId);
      if (courseData) {
        res.status(200).json(courseData);
      }
    } catch (error) {
      next(error);
    }
  }

  async deleteChapter(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId, chapterId } = req.body;
      const updatedData = await this._courseService.deleteChapterFromCourse(
        courseId,
        chapterId
      );
      if (updatedData) {
        res.status(200).json(updatedData);
      }
    } catch (error) {
      next(error);
    }
  }

  async enrollCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, courseId, couponId } = req.body;
      const enrolledData = await this._courseService.enrollCourse(
        courseId,
        userId,
        couponId
      );
      if (enrolledData) {
        res.status(200).json(enrolledData);
      }
    } catch (error) {
      next(error);
    }
  }

  async getEnrolledCoursesByUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.params.userId;
      const enrolledCourses =
        await this._courseService.getEnrolledCoursesForUser(userId);
      res.status(200).json(enrolledCourses);
    } catch (error) {
      next(error);
    }
  }

  async cancelEnrolledCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, courseId } = req.body;
      const data = await this._courseService.cancelEnrolledCourse(
        userId,
        courseId
      );

      if (data) {
        res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async getEnrolledCourseData(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = req.query.courseId as string;
      const userId = req.query.userId as string;
      const enrolledData = await this._courseService.getEnrolledCourseData(
        courseId,
        userId
      );
      if (enrolledData) {
        res.status(200).json(enrolledData);
      }
    } catch (error) {
      next(error);
    }
  }

  async updateCourseProgression(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, courseId, chapterId } = req.body;
      const updateData = await this._courseService.updateCourseProgression(
        userId,
        courseId,
        chapterId
      );

      if (updateData) {
        res.status(200).json(updateData);
      }
    } catch (error) {
      next(error);
    }
  }

  async addReviewForCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId, userId, review } = req.body;

      const data = await this._courseService.addReviewForCourse(
        courseId,
        userId,
        review
      );

      if (data) {
        res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async getAllReviewsOfCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = req.params.courseId;
      const reviewData = await this._courseService.getAllReviewsOfCourse(courseId);
      if (reviewData) {
        res.status(200).json(reviewData);
      }
    } catch (error) {
      next(error);
    }
  }

  // async addRatingForCourse(req: Request, res:Response, next:NextFunction){
  //   try {

  //     const { courseId, userId, rating } = req.body
  //     const data = await this._courseService.addRatingForCourse(courseId,userId,rating);
  //     if(data){
  //       res.status(200).json(data)
  //     }

  //   } catch (error) {
  //     throw error
  //   }
  // }
}