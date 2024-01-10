import { IReview } from "../../models/Review";

export interface IReviewRepository {
  createReview(reviewData: IReview): Promise<IReview>;
  checkExistingReview(
    courseId: string,
    userId: string
  ): Promise<IReview | null>;
  addCommentForCourse(
    courseId: string,
    userId: string,
    comment: string
  ): Promise<IReview | null>;
  getAllReviewsOfCourse(courseId: string): Promise<IReview[] | null>;

//   addRatingForCourse(courseId: string, userId: string, rating: number) : Promise<IReview | null>;
}