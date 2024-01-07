
import mongoose, { Document, model, Schema } from "mongoose";

export interface ICoupon{
    couponCode?: string;
    discountType?: string;
    discountAmount?: string;
    maxDiscountAmount?: string;
    minPurchaseAmount?: string;
    expiredDate?: Date;
    usedUser?: string[];
    status?:boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const couponSchema = new Schema<ICoupon>({
  couponCode: {
    type: String,
    required: true,
  },
  discountType: {
    type: String,
    required: true,
  },
  discountAmount: {
    type: String,
    required: true,
  },
  maxDiscountAmount: {
    type: String,
    required: true,
  },
  minPurchaseAmount: {
    type: String,
    required: true,
  },
  expiredDate: {
    type: Date,
    required: true,
  },
  usedUser:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
    }      
  ],
  status: {
    type: Boolean,
    default: true

  }
},
{timestamps: true});

export default model<ICoupon>('Coupon',couponSchema)
