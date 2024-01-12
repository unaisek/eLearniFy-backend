import mongoose, { Schema } from "mongoose";
import Chapter, { IChapter } from "../models/Chapter";
import Course,{ ICourse} from "../models/Course";
import { ICourseRepository } from "./interfaces/ICourseRepository";

export default class CourseRepository implements ICourseRepository {
  async createCourse(courseData: Partial<ICourse>): Promise<ICourse | null> {
    try {
      return await Course.create(courseData);
    } catch (error) {
      return null;
    }
  }

  async createChapter(chapterData: Partial<IChapter>): Promise<IChapter> {
    return await Chapter.create(chapterData);
  }

  async addChapterToCourse(
    courseId: string,
    chapter: { chapter: string; order: number }
  ): Promise<ICourse | null> {
    try {
      const course = await Course.findById(courseId);
      if (!course) {
        throw Error("course not found");
      }
      course.chapters.push(chapter);
      return await course.save();
    } catch (error) {
      return null;
    }
  }

  async getAllCourses(tutorId: string): Promise<ICourse[] | null> {
    try {
      return await Course.find({ tutor: tutorId })
        .populate("tutor")
        .populate("category");
    } catch (error) {
      return null;
    }
  }

  async findCourseById(courseId: string): Promise<ICourse | null> {
    try {
      return await Course.findById(courseId)
        .populate("tutor")
        .populate("category")
        .populate("chapters.chapter");
    } catch (error) {
      return null;
    }
  }

  async updateCourse(
    courseId: string,
    updatedData: Partial<ICourse>
  ): Promise<ICourse | null> {
    try {
      return await Course.findByIdAndUpdate(courseId, updatedData);
    } catch (error) {
      return null;
    }
  }

  async updateChapter(
    chapterId: string,
    chapterData: Partial<IChapter>
  ): Promise<IChapter | null> {
    try {
      return await Chapter.findByIdAndUpdate(chapterId, chapterData);
    } catch (error) {
      return null;
    }
  }

  async getCoursesForStudents(): Promise<ICourse[] | null> {
    try {
      return await Course.find({ status: true })
        .populate("tutor")
        .populate("category")
        .populate("chapters.chapter");
    } catch (error) {
      return null;
    }
  }

  async unlistCourse(courseId: string): Promise<ICourse | null> {
    try {
      return await Course.findByIdAndUpdate(
        courseId,
        { status: false },
        { new: true }
      );
    } catch (error) {
      return null;
    }
  }

  async listCourse(courseId: string): Promise<ICourse | null> {
    try {
      return await Course.findByIdAndUpdate(
        courseId,
        { status: true },
        { new: true }
      );
    } catch (error) {
      return null;
    }
  }

  async deleteChapterFromCourse(
    courseId: string,
    chapterId: string
  ): Promise<ICourse | null> {
    try {
      return await Course.findByIdAndUpdate(
        { _id: courseId },
        { $pull: { chapters: { _id: chapterId } } },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async addEnrolledUserToCourse(
    courseId: string,
    userId: string
  ): Promise<void> {
    try {
      await Course.findByIdAndUpdate(courseId, {
        $push: { enrolledStudents: userId },
      });
    } catch (error) {
      throw error;
    }
  }

  async removeUserFromCourse(courseId: string, userId: string): Promise<void> {
    try {
      await Course.findByIdAndUpdate(courseId, {
        $pull: { enrolledStudents: userId },
      });
    } catch (error) {
      throw error;
    }
  }

  async getCourseCount(): Promise<number> {
    try {
      const courseCount = await Course.countDocuments({ status: true });
      return courseCount;
    } catch (error) {
      throw error;
    }
  }
  async getPaidAndFreeCourseCount(): Promise<number[]> {
    const paidCourseCount = await Course.countDocuments({status:true, courseType:"paid"});
    const freeCourseCount = await Course.countDocuments({status:true, courseType:"free"});
    
    const paidAndFreeCourse = [ paidCourseCount, freeCourseCount ];
    return paidAndFreeCourse;
    
  }

  async getTutorCourseCount(tutorId: string): Promise<number> {
    
    try {

      return await Course.countDocuments({tutor:tutorId})
      
    } catch (error) {
      throw error
    }
  }

  async getEnrolledStudentCountOfTuor(tutorId: string): Promise<number> {
    try {

      const enrolledStudentCount = await Course.aggregate([
        {
          $match: {
            status: true,
            tutor: new mongoose.Types.ObjectId(tutorId),
          },
        },
        {
          $project: {
            studentCount: { $size: "$enrolledStudents" },
          },
        },
        {
          $group:{
            _id:null,
            totalEnrolledStudent: {$sum:"$studentCount" }
          }
        }
      ]);
      
       return enrolledStudentCount.length > 0 ? enrolledStudentCount[0].totalEnrolledStudent : 0
      
    } catch (error) {
      throw error
    }
  }

  async getPaidCourseCountOfTutor(tutorId: string): Promise<number> {
    try {

      return await Course.countDocuments({ status:true, courseType:"paid",tutor:tutorId });
      
    } catch (error) {
      throw error
    }
  }


  async getFreeCourseCountOfTutor(tutorId: string): Promise<number> {
    try {

      return await Course.countDocuments({ status:true, courseType:"free",tutor:tutorId });
      
    } catch (error) {
      throw error
    }
  }
}