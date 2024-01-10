import mongoose, { Mongoose } from "mongoose";
import Review, { IReview } from "../models/Review";
import { IReviewRepository } from "./interfaces/IReviewRepository";

export default class ReviewRepository implements IReviewRepository{
    
    async createReview(reviewData: IReview): Promise<IReview> {
        try {

            return await Review.create(reviewData);
            
        } catch (error) {
            throw error
        }
    }

    async checkExistingReview(courseId: string, userId: string): Promise<IReview | null> {
        try {

           return await Review.findOne({userId, courseId})
            
        } catch (error) {
            throw error
        }
    }

    async getAllReviewsOfCourse(courseId: string): Promise<IReview[] | null> {
        try {
        //   return await  Review.aggregate([
        //      {
        //        $match: { courseId: new mongoose.Types.ObjectId(courseId) }, 
        //      },
        //      {
        //        $unwind: "$comments",
        //      },
        //      {
        //         $lookup: {
        //             from: "users",
        //             localField:"userId",
        //             foreignField:"_id",
        //             as:"user"
        //         }
        //      },
        //      {
        //        $project: {
        //          _id: 1,
        //          user: { $arrayElemAt: ["$user", 0]} ,
        //          courseId: 1,
        //          rating: 1,
        //          comment: "$comments.comment", // Extract the comment field
        //          date: "$comments.date", // Extract the date field
        //        },
        //      },
        //      {
        //        $sort: { date: -1 },
        //      },
        //    ]);

            return await Review.find({courseId}).populate("userId")
            
        } catch (error) {
            throw error
        }
    }

    async addCommentForCourse(courseId: string, userId: string, comment: string): Promise<IReview | null> {
        try {

            return await Review.findOneAndUpdate(
              { courseId, userId },
              {
                $push: {
                  comments: {
                    comment: comment, // Assuming "comment" holds the comment text
                    // date: new Date(), // Add UTC timestamp
                  },
                },
              },
              { new: true }
            );
            
        } catch (error) {
            throw error
        }
    }

    // async addRatingForCourse(courseId: string, userId: string, rating: number): Promise<IReview | null> {
    //     try {

    //         return await Review.findOneAndUpdate(
    //             { courseId, userId },
    //             { $set: { rating : rating } },
    //             { new: true }
    //         )
            
    //     } catch (error) {
    //         throw error
    //     }
    // }
}