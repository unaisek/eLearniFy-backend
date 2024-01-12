import { Request, Response, NextFunction } from  'express';
import TutorService from '../services/tutorService';
import { userInfo } from 'os';

export default class TutorController{

    private _tutorService: TutorService

    constructor() {
        this._tutorService = new TutorService()
    }

    async getDashboardValues(req: Request, res: Response, next: NextFunction){
        try {
            const tutorId = req.params.tutorId
            
            const tutorDashboardData =  await this._tutorService.getTutorDashboardValues(tutorId)
            res.status(200).json(tutorDashboardData)
             
            
        } catch (error) {
            next(error)
        }
    }

}
