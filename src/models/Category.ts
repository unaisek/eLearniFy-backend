import { Document, model, Schema } from "mongoose";

export interface Icategory extends Document{
    categoryName:string;
    description: string;
    createdAt: Date ;
    updatedAt:Date
}

const categorySchema = new Schema<Icategory>({
    categoryName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
},{timestamps:true});

export default model<Icategory>('Category', categorySchema);




