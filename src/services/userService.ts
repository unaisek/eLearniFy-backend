import { Iuser } from "../models/User";
import UserRepository from "../repositories/userRepository";
import AwsS3Service from "./AwsService";
import { IUserService } from "./interfaces/IUserService";
import dotenv from 'dotenv'
dotenv.config()

export default class UserService implements IUserService {
  private _userRepository: UserRepository;
  private _awsService: AwsS3Service;

  constructor() {
    this._userRepository = new UserRepository();
    this._awsService = new AwsS3Service();
  }

  async getAllUsers(): Promise<Iuser[]> {
    try {
      return await this._userRepository.getAllUsers();
    } catch (error) {
      throw Error;
    }
  }

  async blockUser(id: string): Promise<void> {
    try {
      await this._userRepository.blockUser(id);
    } catch (error) {
      throw Error;
    }
  }

  async unBlockUser(id: string): Promise<void> {
    try {
      await this._userRepository.unBlockUser(id);
    } catch (error) {
      throw Error;
    }
  }

  async getUserData(userId: string): Promise<Iuser | null> {
    try {
      return await this._userRepository.findUserById(userId);
    } catch (error) {
      throw Error;
    }
  }

  async uploadProfileImage(
    file: Express.Multer.File[],
    userId: string
  ): Promise<any> {
    try {
      const user = await this._userRepository.findUserById(userId);
      const profileImage = file.find(
        (file: Express.Multer.File) => file.fieldname === "profileImage"
      );

      if (profileImage) {
        let profileImageUrl: string | undefined;
        const profileImageParams: AWS.S3.PutObjectRequest = {
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: `profileImages/${user?.name}`,
          Body: profileImage.buffer,
          ACL: "public-read",
          ContentType: profileImage.mimetype,
        };

        profileImageUrl = await this._awsService.uploadToS3(profileImageParams);
        console.log(profileImageUrl,"profile");

        return await this._userRepository.updateProfileImage(userId,profileImageUrl);
        
      }
    } catch (error) {}
  }
}