import { NextFunction, Request, Response } from "express";
import AdminService from "../services/adminService";
import CourseService from "../services/CourseService";


export default class AdminController {

    private _adminService:AdminService
    private _courseService:CourseService
    constructor() {
        this._adminService = new AdminService()
        this._courseService = new CourseService()
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

    async getAllEnrolledCourses(req:Request, res:Response, next:NextFunction){
        try {
            const year = parseInt(req.params.year)
            
            const enrolledCourses = await this._courseService.getAllEnrolledCourse(year);
            if(enrolledCourses){
                res.status(200).json(enrolledCourses)
            }
            
        } catch (error) {
            next(error)
        }
    }
}
