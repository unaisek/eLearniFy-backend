import { String } from "aws-sdk/clients/cloudwatchevents";
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

  getEnrolledCourseData(
    userId: string,
    courseId: string
  ): Promise<IEnrolledCourse | null>;
  updateCourseProgression(
    userId: string,
    courseId: string,
    chapterId: string
  ): Promise<IEnrolledCourse | null>;

  getTotalRevenue(): Promise<number>;

  getWeeklyRevenue(): Promise<number[]>;
  getCurrentMonthRevenue(): Promise<number>;
  getTotalRevenueOfTutor(tutorId: string): Promise<number>;
  getCurrentMonthRevenueForTutor(tutorId: string): Promise<number>;
  getThreeDaysRevenueOfTutor(tutorId: string): Promise<number[]>;

  getAllEnrolledCourseForAdmin(year: number):Promise<IEnrolledCourse[] | null>
}