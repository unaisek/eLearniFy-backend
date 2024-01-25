import { Schema } from "mongoose";
import { IChapter } from "../../models/Chapter";
import { ICourse } from "../../models/Course";

export interface ICourseRepository {
  createCourse(courseData: Partial<ICourse>): Promise<ICourse | null>;
  addChapterToCourse(
    courseId: string,
    chapter: { chapter: string; order: number }
  ): Promise<ICourse | null>;
  //   findByCourseId(courseId:string):Promise<ICourse| null>;
  getAllCourses(tutorId: string): Promise<ICourse[] | null>;
  findCourseById(courseId: string): Promise<ICourse | null>;
  updateCourse(
    courseId: string,
    updatedData: Partial<ICourse>
  ): Promise<ICourse | null>;
  updateChapter(
    chapterId: string,
    chapterData: IChapter
  ): Promise<IChapter | null>;
  getCourseForStudentHome(): Promise<ICourse[] | null>
  getCoursesForStudents(filter:Record<string, any>): Promise<ICourse[] | null>;
  unlistCourse(courseId: string): Promise<ICourse | null>;
  listCourse(courseId: string): Promise<ICourse | null>;
  deleteChapterFromCourse(
    courseId: string,
    chapterId: string
  ): Promise<ICourse | null>;
  addEnrolledUserToCourse(courseId: string, userId: string): Promise<void>;
  removeUserFromCourse(courseId: string, userId: string): Promise<void>;
  getCourseCount(): Promise<number>;
  getPaidAndFreeCourseCount(): Promise<number[]>;
  getTutorCourseCount(tutorId: string): Promise<number>;
  getEnrolledStudentCountOfTuor(tutorId: string): Promise<number>;
  getPaidCourseCountOfTutor(tutorId: string): Promise<number>;
  getFreeCourseCountOfTutor(tutorId: string): Promise<number>;
}