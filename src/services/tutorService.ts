
import CourseRepository from "../repositories/CourseRepository";
import EnrolledCourseRepository from "../repositories/EnrolledCourseRepository";
import { ITutorService } from "./interfaces/ITutorService";

export interface ITutorDashboardData{
    totalTutorRevenue: number;
    tutorCourseCount?: number,
    enrolledStudent?: number,
    currentMonthRevenue?: number;
    paidCourseCount?:number;
    freeCourseCount?:number;
    threeDaysRevenues?:number [];
}

export default class TutorService implements ITutorService {

  private _enrolledRepository: EnrolledCourseRepository;
  private _courseRepository : CourseRepository

  constructor() {
    this._enrolledRepository = new EnrolledCourseRepository();
    this._courseRepository = new CourseRepository();
  }
  async getTutorDashboardValues(tutorId: string): Promise<ITutorDashboardData> {
    try {
      const totalTutorRevenue = await this._enrolledRepository.getTotalRevenueOfTutor(tutorId);
      const tutorCourseCount = await this._courseRepository.getTutorCourseCount(tutorId);
      const enrolledStudent = await this._courseRepository.getEnrolledStudentCountOfTuor(tutorId);
      const currentMonthRevenue = await this._enrolledRepository.getCurrentMonthRevenueForTutor(tutorId);
      const paidCourseOfTutor = await this._courseRepository.getPaidCourseCountOfTutor(tutorId);
      const freeCourseOfTutor = await this._courseRepository.getFreeCourseCountOfTutor(tutorId);
      const threeDaysRevnueofMonth = await this._enrolledRepository.getThreeDaysRevenueOfTutor(tutorId)
    
      return {
        totalTutorRevenue,
        tutorCourseCount,
        enrolledStudent,
        currentMonthRevenue,
        paidCourseCount: paidCourseOfTutor,
        freeCourseCount: freeCourseOfTutor,
        threeDaysRevenues: threeDaysRevnueofMonth
      }

    } catch (error) {
      throw error;
    }
  }
}