import { Iuser } from "../../models/User";

export interface IUserService {
  getAllUsers(): Promise<Iuser[]>;
  blockUser(id: string): Promise<void>;
  unBlockUser(id: string): Promise<void>;
  getUserData(userId: string): Promise<Iuser | null>;
  uploadProfileImage(file: Express.Multer.File[], userId: string): Promise<Iuser | null>;
}