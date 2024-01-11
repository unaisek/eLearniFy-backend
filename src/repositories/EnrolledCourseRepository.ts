import { log } from "console";
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

  async getEnrolledCourseData(userId: string, courseId: string): Promise<IEnrolledCourse |null> {
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
      throw error
    }
  }

  async updateCourseProgression(userId: string, courseId: string, chapterId: string): Promise<IEnrolledCourse | null> {
    try {

      return await EnrolledCourse.findOneAndUpdate(
        {userId, courseId},
        { $push: { progression : chapterId } },
        { new:true }
      )
      
    } catch (error) {
      throw error
    }
  }

  async getTotalRevenue(): Promise<number> {
    
    const result = await EnrolledCourse.aggregate([
      { 
        $match : { 
          status: true 
        } 
      },
      {
        $group :{
          _id: null,
          totalRevenue: { $sum: { $toDouble: "$price" } }
        }
      }
    ]);

    console.log(result,"revenue");
    
    return result.length > 0 ? result[0].totalRevenue : 0
    
  }
  async  getWeeklyRevenue(): Promise<number[]> {
    try {
      const currentDate = new Date();
      const startDate = new Date(currentDate.getFullYear(),currentDate.getMonth(),1);
      const endDate = new Date(currentDate.getFullYear(),currentDate.getMonth() + 1,0);

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

      console.log(weeklyRevenue);
      

      const weeklyRevenueOfMonth = weeklyRevenue.map((entry)=> entry.weeklyRevenue);
    
      return weeklyRevenueOfMonth || []
      
    } catch (error) {
      throw error
    }
  }

  async getCurrentMonthRevenue(): Promise<number> {
    try {

      const currentDate = new Date();
      const startDate = new Date(currentDate.getFullYear(),currentDate.getMonth(),1);
      const endDate = new Date(currentDate.getFullYear(),currentDate.getMonth() + 1,1);

      const currentMonthRevenue = await EnrolledCourse.aggregate([
        {
          $match: {
            status: true,
            createdAt : {
              $gte: startDate,
              $lt: endDate,
            },
          },
        },
        {
          $group: {
            _id: null,
            monthlyRevenue : { $sum : { $toDouble: "$price" }}
          },
        },
        {
          $project :{
            _id: 0,
            monthlyRevenue: 1
          },
        },
      ]);

      console.log(currentMonthRevenue);
      return currentMonthRevenue.length > 0 ? currentMonthRevenue[0].monthlyRevenue : 0
      
      
    } catch (error) {
      throw error
    }
  }

 
}