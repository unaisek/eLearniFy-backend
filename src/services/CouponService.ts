import { ICoupon } from "../models/Coupon";
import CouponRepository from "../repositories/CouponRepository";
import { ICouponService } from "./interfaces/ICouponService";

export default class CouponService implements ICouponService {
  private _couponRepository: CouponRepository;

  constructor() {
    this._couponRepository = new CouponRepository();
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
}