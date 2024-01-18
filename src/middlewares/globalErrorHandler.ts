import { Request, Response, NextFunction } from 'express';
import CustomError from '../common/errors/customError';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) =>{

    if(err instanceof CustomError){
         return res.status(err.statusCode).send({errors:err.serializeError()})
    }
    res.status(400).send({
        message:"Some thing went wrong"
    })
    // next(err);
}

export default errorHandler