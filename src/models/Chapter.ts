import mongoose, {Document,model, Schema } from "mongoose";

export interface IChapter extends Document {
  chapterTitle: string;
  chapterDescription: string;
  chapterVideo: string;
  chapterMaterial:string;
  courseId?: string;
  createdAt: Date;
}

const chapterSchema = new Schema<IChapter>({
  chapterTitle: {
    type: String,
    required: true,
  },
  chapterDescription: {
    type: String,
    required: true,
  },
  chapterVideo: {
    type: String,
    required: true,
  },
  chapterMaterial: {
    type: String,
  },
  courseId: {
    type: mongoose.Types.ObjectId,
    ref: 'course',
    required: true
  },
  createdAt :{
    type:Date,
    required:true,
    default: Date.now

  }
});

export default model<IChapter>("Chapter", chapterSchema);