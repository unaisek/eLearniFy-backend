import { Request } from "express";
import { ICourse } from "../../models/Course";
import { IChapter } from "../../models/Chapter";



export interface ICourseService {
  addNewCourse(req: Request): Promise<Partial<ICourse> | null>;

  createChapter(
    chapteData: Partial<IChapter>,
    files: Express.Multer.File[],
    order: number,
    title: string | undefined,
    courseId: string
  ): Promise<ICourse | null>;

  getAllCourses(id: string): Promise<ICourse[] | null>;

  getCourseDetails(id: string): Promise<ICourse | null>;

  updateCourse(
    courseId: string,
    courseData: Partial<ICourse>,
    files: Express.Multer.File[] | undefined
  ): Promise<ICourse | null>;

  updateChapter(
    id: string,
    chapterData: Partial<IChapter>,
    files: Express.Multer.File[],
    courseTitle: string
  ): Promise<IChapter | null>;

  getAllCourseForStudents(): Promise<ICourse[] | null>;

  createCheckoutSession(courseId: string): Promise<string>;

  unlistCourse(courseId: string): Promise<ICourse | null>;
  listCourse(courseId:string):Promise<ICourse | null>;
  
}