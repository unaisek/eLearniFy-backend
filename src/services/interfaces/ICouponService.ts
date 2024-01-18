import { ICoupon } from "../../models/Coupon";

export interface ICouponService {
  addNewCoupon(couponData: ICoupon): Promise<ICoupon>;
  getAllCoupons(): Promise<ICoupon[] | null>;
  updateCoupon(couponId: string, couponData: ICoupon): Promise<ICoupon | null>;
  unlistCoupon(couponId: string): Promise<ICoupon | null>;
  listCoupon(couponId: string): Promise<ICoupon | null>;
  getAllCouponsForStudent(userId: string): Promise<ICoupon[] | null>;
  applyCoupon(
    couponId: string,
    courseId: string,
    userId: string
  ): Promise<ICoupon | null>;
  
}