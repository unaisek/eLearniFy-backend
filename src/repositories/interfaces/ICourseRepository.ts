import { IChapter } from "../../models/Chapter";
import { ICourse } from "../../models/Course";

export interface ICourseRepository {
  createCourse(courseData: Partial<ICourse>): Promise<ICourse | null>;
  addChapterToCourse(courseId:string,chapter:{chapter:string,order:number}):Promise <ICourse |null>;
//   findByCourseId(courseId:string):Promise<ICourse| null>;
}