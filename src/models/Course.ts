import { timeStamp } from "console";
import mongoose, { Document, model, Schema } from "mongoose";
import { IChapter } from "./Chapter";

export interface ICourse extends Document {
  title: string;
  category?: string;
  level: string;
  courseType: string;
  price: string;
  description: string;
  thumbnail: string;
  introductionVideo:string;
  chapters:{chapter:string, order:number }[];
  tutor?:string;
  enrolledStudents?:string[];
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// export interface Ichapter {
//   chapterTitle: string;
//   chapterDescription: string;
//   chapterVideo: string;
//   chapterMaterial: string;
// }

const courseSchema = new Schema<ICourse>({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Category',
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  courseType: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    default: "0",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  introductionVideo: {
    type: String,
    required: true,
  },
  chapters :[
    {
        chapter:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Chapter'
        },
        order:{
            type: Number
        } 

    }
  ],
  tutor:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  enrolledStudents:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
    }
  ],
  status:{
    type: Boolean,
    default:true
  }
},{timestamps:true});

export default model<ICourse>('Course',courseSchema)