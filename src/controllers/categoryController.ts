import exp from "constants";
import { Request, Response, NextFunction } from "express";
import CatogoryService from "../services/categoryService";

export default class CategoryController{

    private _categoryService: CatogoryService

    constructor(){
        this._categoryService = new CatogoryService();
    }

    async addCategory(req:Request, res:Response, next:NextFunction){
       try {
           const category = req.body;
        
           const categoryData = await this._categoryService.createCategory(category);     
           if (categoryData) {
               return res.status(201).json(categoryData);
           } else {
               return res.status(500).json({ message: "Failed to add category ...!!" })
           }
        
       } catch (error) {
        next(error)
       }
    }

    // get all category

    async getAllCategory(req:Request, res: Response, next:NextFunction){
        try {
            const categoryData = await this._categoryService.getAllCategory();        
            res.status(200).json(categoryData)

        } catch (error) {
            next(error)
        }

    }

    
}