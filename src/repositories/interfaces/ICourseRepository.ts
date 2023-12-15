import { Schema } from "mongoose";
import { IChapter } from "../../models/Chapter";
import { ICourse } from "../../models/Course";

export interface ICourseRepository {
  createCourse(courseData: Partial<ICourse>): Promise<ICourse | null>;
  addChapterToCourse(courseId:string,chapter:{chapter:string,order:number}):Promise <ICourse |null>;
//   findByCourseId(courseId:string):Promise<ICourse| null>;
  getAllCourses(tutorId:string):Promise<ICourse[] | null>
  findCourseById(courseId:string): Promise <ICourse | null>;

  updateCourse(courseId:string ,updatedData:Partial<ICourse>):Promise<ICourse | null>;

}