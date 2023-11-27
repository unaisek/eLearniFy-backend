import { Request, Response, NextFunction } from "express";
import UserService from "../services/userService";

export default class UserController{
    private _userService: UserService;

    constructor() {
        this._userService = new UserService();
    }

    async getAllUsers(req: Request, res: Response, next:NextFunction){
        try {

            const userList = await this._userService.getAllUsers();
            return res.status(200).json(userList);
            
        } catch (error) {
            next(error)
        }
    }

    async blockUser(req: Request, res: Response, next:NextFunction){
        try {

            const userId = req.params.id;
            await this._userService.blockUser(userId);
            res.status(200).json({
                message:"User is Blocked"
            })
            
        } catch (error) {
            next(error)
        }
    }

    async UnBlockUser(req: Request, res: Response, next: NextFunction){
        const userId = req.params.id;
        await this._userService.unBlockUser(userId);
        res.status(200).json({
            message:"User is Unblocked"
        })
    }
}