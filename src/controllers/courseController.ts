import { log } from "console";
import { Request,Response,NextFunction } from "express";
import CourseService from "../services/CourseService";

export default class  CourseController{
    private _courseService:CourseService

    constructor() {
        this._courseService = new CourseService
    }
    async addNewCourse( req:Request, res:Response, next:NextFunction){
        try {                                  
            const courseData = await this._courseService.addNewCourse(req);
            const courseTitle :string |undefined = courseData?.title;
            const order = (courseData?.chapters.length || 0) + 1;
            const courseId = courseData?._id
             await this._courseService.createChapter(req,order,courseTitle,courseId);
             res.status(200).json(courseData);
                        
        } catch (error) {
            next(error)
        }
    }
}