import { ICoupon } from "../../models/Coupon";

export interface ICouponRepository {
  createCoupon(couponData: ICoupon): Promise<ICoupon>;
  getAllCoupons(): Promise<ICoupon[] | null>;
  updateCoupon(couponId: string, couponData:ICoupon): Promise<ICoupon | null>;
  updateStatusCoupon(couponId: string , status: boolean): Promise <ICoupon | null>
  getAllCouponsForStudent(userId: string): Promise<ICoupon[] | null>;
  findCouponById(couponId:string):Promise<ICoupon | null>
  addUserToCoupon(couponId: string, userId:string): Promise<void>;
}