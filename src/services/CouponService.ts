import BadRequestError from "../common/errors/badRequestError";
import CourseController from "../controllers/courseController";
import { ICoupon } from "../models/Coupon";
import CouponRepository from "../repositories/CouponRepository";
import CourseRepository from "../repositories/CourseRepository";
import { ICouponService } from "./interfaces/ICouponService";

export interface IPaymentData {
    email?:string;
    paymentMethod?:string;
}

export default class CouponService implements ICouponService {
  private _couponRepository: CouponRepository;
  private _courseRepositor:CourseRepository

  constructor() {
    this._couponRepository = new CouponRepository();
    this._courseRepositor = new CourseRepository()
  }

  async addNewCoupon(couponData: ICoupon): Promise<ICoupon> {
    try {
      return await this._couponRepository.createCoupon(couponData);
    } catch (error) {
      throw error;
    }
  }

  async getAllCoupons(): Promise<ICoupon[] | null> {
    try {
      return await this._couponRepository.getAllCoupons();
    } catch (error) {
      throw error;
    }
  }

  async updateCoupon(
    couponId: string,
    couponData: ICoupon
  ): Promise<ICoupon | null> {
    try {
      return await this._couponRepository.updateCoupon(couponId, couponData);
    } catch (error) {
      throw error;
    }
  }

  async unlistCoupon(couponId: string): Promise<ICoupon | null> {
    try {
      return await this._couponRepository.updateStatusCoupon(couponId, false);
    } catch (error) {
      throw error;
    }
  }

  async listCoupon(couponId: string): Promise<ICoupon | null> {
    try {
      return await this._couponRepository.updateStatusCoupon(couponId, true);
    } catch (error) {
      throw error;
    }
  }

  async getAllCouponsForStudent(userId: string): Promise<ICoupon[] | null> {
      try {

        return await this._couponRepository.getAllCouponsForStudent(userId);
        
      } catch (error) {
        throw error
      }
  }

  async applyCoupon(couponId: string, courseId:string, userId:string): Promise<ICoupon | null> {
      try {
        const cousreData = await this._courseRepositor.findCourseById(courseId)
        const couponData = await this._couponRepository.findCouponById(couponId);
        if(couponData){
            const currentDate = new Date();
            if(currentDate > new Date(couponData?.expiredDate!)){
                throw new BadRequestError("Coupon is expired")
            }
            if(couponData.minPurchaseAmount && cousreData?.price! < couponData.minPurchaseAmount){
                throw new BadRequestError(
                  "Minimum purchase amount not met for the coupon"
                );
                
            } if(couponData.usedUser && couponData.usedUser.includes(userId)){
                throw new BadRequestError(
                  "Coupon has already been used by the user"
                );
            }
        }
        return couponData
      } catch (error) {
        throw error
      }
  }
}