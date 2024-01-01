import EnrolledCourse, { IEnrolledCourse } from "../models/EnrolledCourse";
import { IEnrolledCourseRepo } from "./interfaces/IEnrolledCourseRepository";

export default class EnrolledCourseRepository implements IEnrolledCourseRepo {
  async createEnrolledCourse(
    enrolledData: Partial<IEnrolledCourse>
  ): Promise<IEnrolledCourse> {
    try {
      const enrolledCourse = await EnrolledCourse.create(enrolledData);
      return enrolledCourse;
    } catch (error) {
      throw error;
    }
  }

  async checkEnrolledCourse(
    userId: string,
    courseId: string
  ): Promise<IEnrolledCourse | null> {
    try {
      return await EnrolledCourse.findOne({ userId, courseId });
    } catch (error) {
      throw error;
    }
  }

  async getAllEnrolledCourseForUser(
    userId: string
  ): Promise<IEnrolledCourse[] | null> {
    try {
      return await EnrolledCourse.find({
        userId: userId,
        status: true,
      }).populate({
        path: "courseId",
        model: "Course",
        populate: [
          {
            path: "category",
            model: "Category",
          },
          {
            path: "chapters.chapter",
            model: "Chapter",
          },
          {
            path: "tutor",
            model: "User",
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  }

  async updateEnrolledCourseStatus(
    userId: string,
    courseId: string,
    status : boolean,
  ): Promise<IEnrolledCourse | null> {
    try {
      return await EnrolledCourse.findOneAndUpdate(
        { userId: userId, courseId: courseId },
        { $set: { status: status } },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }
}