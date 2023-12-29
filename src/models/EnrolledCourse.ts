import mongoose, { Document, model, Schema } from "mongoose";

export interface IEnrolledCourse extends Document{

    courseId?:string;
    price?:string;
    status?: boolean;
    userId?: string;
    progression?: string[];
    createdAt?:Date;
    updatedAt?:Date;

}

const enrolledCourseSchema = new Schema<IEnrolledCourse>({
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course',
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:Boolean,
        default:true
    },
    price:{
        type:String,
        required: true
    },
    progression:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Chapter'
        }
    ]

},
{timestamps:true}
)
 
export default model<IEnrolledCourse>('EnrolledCourse',enrolledCourseSchema)