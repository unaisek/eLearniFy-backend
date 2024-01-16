
import EnrolledCourse, { IEnrolledCourse } from "../models/EnrolledCourse";
import { IEnrolledCourseRepo } from "./interfaces/IEnrolledCourseRepository";
import mongoose from "mongoose";


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
    status: boolean
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

  async getEnrolledCourseData(
    userId: string,
    courseId: string
  ): Promise<IEnrolledCourse | null> {
    try {
      return await EnrolledCourse.findOne({ userId, courseId }).populate({
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

  async updateCourseProgression(
    userId: string,
    courseId: string,
    chapterId: string
  ): Promise<IEnrolledCourse | null> {
    try {
      return await EnrolledCourse.findOneAndUpdate(
        { userId, courseId },
        { $push: { progression: chapterId } },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async getTotalRevenue(): Promise<number> {
    const result = await EnrolledCourse.aggregate([
      {
        $match: {
          status: true,
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $toDouble: "$price" } },
        },
      },
    ]);


    return result.length > 0 ? result[0].totalRevenue : 0;
  }
  async getWeeklyRevenue(): Promise<number[]> {
    try {
      const currentDate = new Date();
      const startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );

      const weeklyRevenue = await EnrolledCourse.aggregate([
        {
          $match: {
            status: true,
            createdAt: {
              $gte: startDate,
              $lt: endDate,
            },
          },
        },
        {
          $project: {
            createdAt: 1,
            price: { $toDouble: "$price" },
          },
        },
        {
          $group: {
            _id: {
              $week: {
                date: "$createdAt",
                timezone: "UTC",
              },
            },
            weeklyRevenue: { $sum: "$price" },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);


      const weeklyRevenueOfMonth = weeklyRevenue.map(
        (entry) => entry.weeklyRevenue
      );

      return weeklyRevenueOfMonth || [];
    } catch (error) {
      throw error;
    }
  }

  async getCurrentMonthRevenue(): Promise<number> {
    try {
      const currentDate = new Date();
      const startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      );

      const currentMonthRevenue = await EnrolledCourse.aggregate([
        {
          $match: {
            status: true,
            createdAt: {
              $gte: startDate,
              $lt: endDate,
            },
          },
        },
        {
          $group: {
            _id: null,
            monthlyRevenue: { $sum: { $toDouble: "$price" } },
          },
        },
        {
          $project: {
            _id: 0,
            monthlyRevenue: 1,
          },
        },
      ]);

      return currentMonthRevenue.length > 0
        ? currentMonthRevenue[0].monthlyRevenue
        : 0;
    } catch (error) {
      throw error;
    }
  }

  async getTotalRevenueOfTutor(tutorId: string): Promise<number> {
    try {
      const tutorRevenue = await EnrolledCourse.aggregate([
        {
          $match: {
            status: true,
          },
        },
        {
          $lookup: {
            from: "courses",
            localField: "courseId",
            foreignField: "_id",
            as: "course",
          },
        },
        {
          $unwind: "$course",
        },
        {
          $match: {
            "course.tutor": new mongoose.Types.ObjectId(tutorId),
          },
        },
        {
          $project: {
            _id: 0,
            tutorRevenue: { $multiply: [{ $toDouble: "$price" }, 0.7] },
          },
        },
        {
          $group: {
            _id: null,
            totalTutorRevenue: { $sum: "$tutorRevenue" },
          },
        },
      ]);

       if (tutorRevenue.length > 0 ) {
          const roundedTutorRevenue = Math.round(tutorRevenue[0].totalTutorRevenue);
          return roundedTutorRevenue;
          
        } else {
          return 0;
        }
    } catch (error) {
      throw error;
    }
  }

  async getCurrentMonthRevenueForTutor(tutorId: string): Promise<number> {
    try {
      const currentDate = new Date();
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
      const currentMonthRevenueOfTutor = await EnrolledCourse.aggregate([
        {
          $match:{
            status: true,
            createdAt: {
              $gt: startDate,
              $lt: endDate,
            },
          },
        },
        {
          $lookup: {
            from: "courses",
            localField: "courseId",
            foreignField: "_id",
            as:"course"
          }
        },
        {
          $unwind:"$course"
        },
        {
          $match:{
            "course.tutor":new mongoose.Types.ObjectId(tutorId)
          }
        },
        {
          $project:{
            _id: 0,
            totalRevenue : { $multiply : [{ $toDouble : "$price"},0.7] }
          }
        },
        {
          $group: {
            _id:null,
            monthlyRevenue : { $sum: "$totalRevenue"}
          }
        }
      ]);
      
      return currentMonthRevenueOfTutor.length > 0 
        ? Math.round(currentMonthRevenueOfTutor[0].monthlyRevenue) 
        : 0;

    } catch (error) {
      throw error
    }
  }

  async getThreeDaysRevenueOfTutor(tutorId: string): Promise<number[]> {
    try {
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29);      
      const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      const threeDaysIntervalRevenue = await EnrolledCourse.aggregate([
        {
          $match: {
            status: true,
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          $lookup: {
            from: "courses",
            localField: "courseId",
            foreignField: "_id",
            as: "course",
          },
        },
        {
          $unwind: "$course",
        },
        {
          $match: {
            "course.tutor": new mongoose.Types.ObjectId(tutorId),
          },
        },
        {
          $project: {
            createdAt: 1,
            price: { $multiply: [{ $toDouble: "$price" }, 0.7] },
          },
        },
        {
          $group: {
            _id: {
              $add: [
                { $subtract: [{ $dayOfMonth: "$createdAt" }, 1] },
                { $mod: [{ $dayOfMonth: "$createdAt" }, 3] },
              ],
            },
            intervalRevenue: { $sum: "$price" },
          },
        },
        {
          $sort: { _id: -1 },
        },
      ]);
     
      const daysDifference = Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);

      
      const totalIntervals = Math.ceil((daysDifference + 1) / 3);

      const allIntervals = Array.from({ length: totalIntervals }, (_, index) => index + 1);
      const threeDaysIntervalRevenueOfMonth = allIntervals.map((interval) => {
        const existingInterval = threeDaysIntervalRevenue.find(
          (entry) => entry._id === interval
        );
        return existingInterval ? Math.round(existingInterval.intervalRevenue) : 0;
      });

      const sorted = threeDaysIntervalRevenueOfMonth.reverse()
      
    return sorted;
      
    } catch (error) {
      throw error
    }
  }
}