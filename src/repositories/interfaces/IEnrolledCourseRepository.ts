import { IEnrolledCourse } from "../../models/EnrolledCourse";

export interface IEnrolledCourseRepo {
  createEnrolledCourse(enrolledData: IEnrolledCourse): Promise<IEnrolledCourse>;
  checkEnrolledCourse(
    userId: string,
    courseId: string
  ): Promise<IEnrolledCourse | null>;

  getAllEnrolledCourseForUser(
    userId: string
  ): Promise<IEnrolledCourse[] | null>;

  updateEnrolledCourseStatus(
    userId: string,
    courseId: string,
    status: boolean
  ): Promise<IEnrolledCourse | null>;
}