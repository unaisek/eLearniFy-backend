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
}