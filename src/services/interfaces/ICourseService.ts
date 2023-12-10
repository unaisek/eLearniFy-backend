import { Request } from "express";


export interface ICourseService{
    addNewCourse(req:Request):Promise <any>;
}