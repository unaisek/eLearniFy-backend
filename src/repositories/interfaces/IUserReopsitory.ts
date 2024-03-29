import { Iuser } from "../../models/User";

export interface IUserRepository {
  getAllUsers(): Promise<Iuser[]>;
  blockUser(id: string): Promise<void>;
  unBlockUser(id: string): Promise<void>;
  findUserById(userId: string): Promise<Iuser | null>;
  updateProfileImage(
    userId: string,
    profileImage: string
  ): Promise<Iuser | null>;
  enrollCourse(userId: string, courseId: string): Promise<void>;
  removeCourseFromUser(userId: string, courseId: string): Promise<void>;
  getTotalUsersCount(): Promise<number>;
  getStudentCount():Promise<number>;
  getTutorCount(): Promise<number>;
}