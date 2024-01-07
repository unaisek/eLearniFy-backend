import Coupon, { ICoupon } from "../models/Coupon";
import { ICouponRepository } from "./interfaces/ICouponRepository";

export default class CouponRepository implements ICouponRepository{
    async createCoupon(couponData: ICoupon): Promise<ICoupon> {
        try {

            return await Coupon.create(couponData);

            
        } catch (error) {
            throw error
        }
    }

    async getAllCoupons(): Promise<ICoupon[] | null> {
        try {

            return await Coupon.find({}).exec();
            
        } catch (error) {
            throw error
        }
    }

    async updateCoupon(couponId: string, couponData: ICoupon): Promise<ICoupon | null> {
        try {
            
            const updateData = await Coupon.findOneAndUpdate(
                {_id : couponId},
                couponData,
                {new : true}
                );

            return updateData

        } catch (error) {
            throw error
        }
    }

    async  updateStatusCoupon(couponId: string, status: boolean): Promise<ICoupon | null> {
        try {

            return await Coupon.findOneAndUpdate(
                { _id: couponId },
                { $set: { status: status } },
                { new: true }
            )
            
        } catch (error) {
            throw error
        }
    }
}