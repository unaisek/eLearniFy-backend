import { NextFunction, Request, Response } from "express";
import AdminService from "../services/adminService";


export default class AdminController {

    private _adminService:AdminService
    constructor() {
        this._adminService = new AdminService()
    }
  async getValuesForDashboard(req: Request, res: Response, next: NextFunction) {
    try {

        const dashboardData = await this._adminService.getAdminDashboardValue();
        console.log(dashboardData);
        res.status(200).json(dashboardData)
        

    } catch (error) {
      next(error);
    }
  }
}
