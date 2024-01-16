
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import UserService from "../services/userService";
import BadRequestError from "../common/errors/badRequestError";
import ForBiddenError from "../common/errors/forBiddenError";
import UnAuthorizedError from "../common/errors/unAuthorizedError";

const userSerice = new UserService();

export const isStudentAuth = async (
    req:Request, 
    res:Response , 
    next:NextFunction
   ) => {
    try {
        
        const authorizationHeader = req.headers.authorization;
        if(authorizationHeader){
            if(typeof authorizationHeader == 'string'){
                const token = authorizationHeader.split(' ')[1];                
                if(token){
                    const decoded = jwt.verify(token, process.env.JWT_SECRET!)as JwtPayload
                    const userId = decoded._id;
                    const userData = await userSerice.getUserData(userId);
                    
                    if(userData !== null){
                        if(userData.is_blocked){
                            throw new ForBiddenError("User is blocked")
                        } else {
                            next()
                        }
                    } else {
                        throw new UnAuthorizedError("Authentication failed -User not found")
                    }
                } else {
                    throw new UnAuthorizedError("Authentication failed -Inavlid token")
                }
            }
        }              
    } catch (error) {
        throw new UnAuthorizedError("invalid token");
        res.send({})
    }
}


export const isTutorAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
      if (typeof authorizationHeader == "string") {
        const token = authorizationHeader.split(" ")[1];
        if (token) {
          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
          ) as JwtPayload;
          const userId = decoded._id;
          const userData = await userSerice.getUserData(userId);
          if (userData !== null) {
            if (userData.is_blocked) {
              throw new ForBiddenError("User is blocked");
            } else if (userData?.role !== "tutor") {
              throw new UnAuthorizedError("Authentication failed -invalid token");
            } else {
              next();
            }
          } else {
            throw new UnAuthorizedError(
              "Authentication failed -User not found"
            );
          }
        } else {
          throw new UnAuthorizedError("Authentication failed -Inavlid token");
        }
      }
    }
  } catch (error) {
    throw new UnAuthorizedError("invalid token");
    res.send({});
  }
};

export const isAdminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
      if (typeof authorizationHeader == "string") {
        const token = authorizationHeader.split(" ")[1];
        if (token) {
          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
          ) as JwtPayload;
          const userId = decoded._id;
          const userData = await userSerice.getUserData(userId);
          if (userData !== null) {
            if (userData.is_blocked) {
              throw new ForBiddenError("User is blocked");
            } else if (!userData.is_admin) {
              throw new UnAuthorizedError(
                "Authentication failed -invalid token"
              );
            } else {
              next();
            }
          } else {
            throw new UnAuthorizedError(
              "Authentication failed -User not found"
            );
          }
        } else {
          throw new UnAuthorizedError("Authentication failed -Inavlid token");
        }
      }
    }
  } catch (error) {
    throw new UnAuthorizedError("invalid token");
    res.send({});
  }
};