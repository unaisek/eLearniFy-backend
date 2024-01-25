import { Request } from "express";
import { ICourse } from "../../models/Course";
import { IChapter } from "../../models/Chapter";
import { IEnrolledCourse } from "../../models/EnrolledCourse";
import { IReview } from "../../models/Review";
import { IPaymentData } from "../CouponService";



export interface ICourseService {
  addNewCourse(req: Request): Promise<Partial<ICourse> | null>;

  createChapter(
    chapteData: Partial<IChapter>,
    files: Express.Multer.File[],
    order: number,
    title: string | undefined,
    courseId: string
  ): Promise<ICourse | null>;

  getAllCourses(id: string): Promise<ICourse[] | null>;

  getCourseDetails(id: string): Promise<ICourse | null>;

  updateCourse(
    courseId: string,
    courseData: Partial<ICourse>,
    files: Express.Multer.File[] | undefined
  ): Promise<ICourse | null>;

  updateChapter(
    id: string,
    chapterData: Partial<IChapter>,
    files: Express.Multer.File[],
    courseTitle: string
  ): Promise<IChapter | null>;

  getCourseForStudentHome(): Promise<ICourse[] | null>;

  getAllCourseForStudents(filter:Record<string,any>): Promise<ICourse[] | null>;

  createCheckoutSession(
    courseId: string,
    userId: string,
    couponId: string,
    paymentData: IPaymentData
  ): Promise<string | IEnrolledCourse>;

  unlistCourse(courseId: string): Promise<ICourse | null>;

  listCourse(courseId: string): Promise<ICourse | null>;

  deleteChapterFromCourse(
    courseId: string,
    chapterId: string
  ): Promise<ICourse | null>;

  enrollCourse(
    courseId: string,
    userId: string,
    couponId: string
  ): Promise<IEnrolledCourse | null>;
  getEnrolledCoursesForUser(userId: string): Promise<IEnrolledCourse[] | null>;

  cancelEnrolledCourse(
    userId: string,
    courseId: string
  ): Promise<IEnrolledCourse | null>;

  getEnrolledCourseData(
    courseId: string,
    userId: string
  ): Promise<IEnrolledCourse | null>;

  updateCourseProgression(
    userId: string,
    courseId: string,
    chapterId: string
  ): Promise<IEnrolledCourse | null>;

  addReviewForCourse(
    courseId: string,
    userId: string,
    reviewData: IReview
  ): Promise<IReview | null>;

  getAllReviewsOfCourse(courseId: string): Promise<IReview[] | null>;

  // paymentWithWallet(courseId: string, userId: string, paymentData:IPaymentData ): Promise<IEnrolledCourse | null>

  // addRatingForCourse(courseId: string, userId: string, rating: number): Promise<IReview | null>
}