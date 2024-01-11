import CourseRepository from "../repositories/CourseRepository";
import EnrolledCourseRepository from "../repositories/EnrolledCourseRepository";
import UserRepository from "../repositories/userRepository";
import { IAdminService } from "./interfaces/IAdminService";

export interface IAdminDashboardData{
    totalRevenue:number;
    totalUserCount: number;
    studentCount:number;
    tutorCount: number;
    courseCount: number;
    weeklyRevenueOfMonth: number[];
    currentMonthRevenue: number;
    paidAndFreeCourseCount: number[];


}

export default class AdminService implements IAdminService{

    private _enrolledCourseRepository:EnrolledCourseRepository;
    private _userRepository: UserRepository;
    private _courseRepository: CourseRepository;

    constructor() {
        this._enrolledCourseRepository = new EnrolledCourseRepository();
        this._userRepository = new UserRepository();
        this._courseRepository = new CourseRepository();
    }
    async getAdminDashboardValue(): Promise<IAdminDashboardData> {

        const totalRevenue = await this._enrolledCourseRepository.getTotalRevenue();
        const totalUserCount = await this._userRepository.getTotalUsersCount();
        const studentCount = await this._userRepository.getStudentCount();
        const tutorCount = await this._userRepository.getTutorCount();
        const courseCount = await this._courseRepository.getCourseCount();
        const weeklyRevenueOfMonth = await this._enrolledCourseRepository.getWeeklyRevenue();
        const currentMonthRevenue = await this._enrolledCourseRepository.getCurrentMonthRevenue()
        const paidAndFreeCourseCount = await this._courseRepository.getPaidAndFreeCourseCount();


        return {
            totalRevenue,
            totalUserCount,
            studentCount,
            tutorCount,
            courseCount,
            weeklyRevenueOfMonth,
            currentMonthRevenue,
            paidAndFreeCourseCount
        }

    }

}