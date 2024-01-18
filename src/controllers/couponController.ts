import { NextFunction, Response, Request } from "express";
import CouponService from "../services/CouponService";

export default class CouponController {
  private _couponService: CouponService;

  constructor() {
    this._couponService = new CouponService();
  }

  async addNewCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const couponData = await this._couponService.addNewCoupon(data);
      if (couponData) {
        res.status(200).json(couponData);
      }
    } catch (error) {
      next(error);
    }
  }

  async getAllCoupons(req: Request, res: Response, next: NextFunction) {
    try {
      const couponsData = await this._couponService.getAllCoupons();

      if (couponsData) {
        res.status(200).json(couponsData);
      }
    } catch (error) {
      next(error);
    }
  }

  async updateCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const { couponId, couponData } = req.body;
      const updateData = await this._couponService.updateCoupon(
        couponId,
        couponData
      );
      if (updateData) {
        res.status(200).json(updateData);
      }
    } catch (error) {
      next(error);
    }
  }

  async unlistCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const { couponId } = req.body;

      const updatedData = await this._couponService.unlistCoupon(couponId);
      
      if (updatedData) {
        res.status(200).json(updatedData);
      }
    } catch (error) {
      next(error);
    }
  }

  async listCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const { couponId } = req.body;

      const updatedData = await this._couponService.listCoupon(couponId);
      if (updatedData) {
        res.status(200).json(updatedData);
      }
    } catch (error) {
      next(error);
    }
  }

  async getAllCouponsForStudent(req:Request, res:Response, next:NextFunction){
    try {

        const userId = req.params.userId;
        const coupons = await this._couponService.getAllCouponsForStudent(userId);
        res.status(200).json(coupons)
        
    } catch (error) {
        next(error)
    }
  }

  async applyCoupon(req: Request, res:Response, next: NextFunction){
    try {
        const couponId = req.query.couponId as string;
        const courseId = req.query.courseId as string;
        const userId = req.query.userId as string;
        

        const couponData = await this._couponService.applyCoupon(couponId,courseId,userId);
        res.status(200).json(couponData)
        
    } catch (error) {
        next(error)
    }
  }
}