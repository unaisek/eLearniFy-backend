import EnrolledCourse, { IEnrolledCourse } from "../models/EnrolledCourse";
import { IEnrolledCourseRepo } from "./interfaces/IEnrolledCourseRepository";

export default class EnrolledCourseRepository implements IEnrolledCourseRepo{
    async createEnrolledCourse(enrolledData: Partial<IEnrolledCourse>): Promise<IEnrolledCourse> {
        try {

            const enrolledCourse = await EnrolledCourse.create(enrolledData);
            return enrolledCourse;
            
        } catch (error) {
            throw error
        }
    }

    async checkEnrolledCourse(userId: string, courseId: string): Promise<IEnrolledCourse | null> {
        try {

            return await EnrolledCourse.findOne({ userId, courseId });
            
        } catch (error) {
            throw error
        }
    }

    async getAllEnrolledCourseForUser(userId: string): Promise<IEnrolledCourse[] | null> {
        try {

            return await EnrolledCourse.find({ userId: userId }).populate({
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
            throw error
        }
    }
}