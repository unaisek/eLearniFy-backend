import mongoose, { Document, model, Schema } from "mongoose";

export interface IReview{
    userId?:string;
    courseId?: string;
    rating?: number;
    review?:string;
    createdAt?: Date;
    updatedAt?: Date;
}

const reviewSchema = new Schema<IReview>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    courseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    rating: {
        type: Number,
        default: 0       
    },
    review:{
        type: String,
        required:true
    }
}, { timestamps: true });

export default model<IReview>('Review',reviewSchema);

