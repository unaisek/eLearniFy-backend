import AwsS3Service from "./AwsService";
import { ICourseService } from "./interfaces/ICourseService";
import { Request } from 'express';
import dotenv from 'dotenv';
import CourseRepository from "../repositories/CourseRepository";
import { ICourse } from "../models/Course";
import { title } from "process";
import { IChapter } from "../models/Chapter";
import Stripe from "stripe";
import EnrolledCourseRepository from "../repositories/EnrolledCourseRepository";
import { IEnrolledCourse } from "../models/EnrolledCourse";
import UserRepository from "../repositories/userRepository";
import WalletRepository from "../repositories/WalletRepository";
import { error } from "console";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
dotenv.config();
const TUTOR_COURSE_PERCENTAGE = 70;
// interface customRequest extends Request  {
//     File?.Express.Multer.File[]
// }

export default class CourseService implements ICourseService {
  private _awsService: AwsS3Service;
  private _courseRepository: CourseRepository;
  private _enrolledRepository: EnrolledCourseRepository;
  private _userRepository:UserRepository;
  private _walletRepository: WalletRepository;
  constructor() {
    this._awsService = new AwsS3Service();
    this._courseRepository = new CourseRepository();
    this._enrolledRepository = new EnrolledCourseRepository();
    this._userRepository = new UserRepository();
    this._walletRepository = new WalletRepository();
  }
  async addNewCourse(req: Request): Promise<Partial<ICourse> | null> {
    try {
      const multerReq = req as any;

      const {
        title,
        category,
        level,
        courseType,
        price,
        description,
        tutorId,
      } = req.body;
      const thumbnail = multerReq.files?.find(
        (file: Express.Multer.File) => file.fieldname === "thumbnail"
      );
      const introductionVideo = multerReq.files?.find(
        (file: Express.Multer.File) => file.fieldname === "introductionVideo"
      );

      let thumbnailURL: string | undefined;
      if (thumbnail) {
        const thumbnailParams: AWS.S3.PutObjectRequest = {
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: `courses/${title}/thumbnail`,
          Body: thumbnail.buffer,
          ACL: "public-read",
          ContentType: thumbnail.mimetype,
        };
        thumbnailURL = await this._awsService.uploadToS3(thumbnailParams);
      }

      let introductionVideoURL: string | undefined;
      if (introductionVideo) {
        const introductionVideoParams: AWS.S3.PutObjectRequest = {
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: `courses/${title}/introductionVideo`,
          Body: introductionVideo.buffer,
          ACL: "public-read",
          ContentType: introductionVideo.mimetype,
        };
        introductionVideoURL = await this._awsService.uploadToS3(
          introductionVideoParams
        );
      }

      const courseData = {
        title,
        category,
        level,
        courseType,
        price,
        description,
        tutor: tutorId,
        thumbnail: thumbnailURL,
        introductionVideo: introductionVideoURL,
      };

      return await this._courseRepository.createCourse(courseData);
    } catch (error) {
      throw Error;
    }
  }

  async createChapter(
    _chapterData:Partial<IChapter>,
    files: Express.Multer.File[],
    order: number,
    title: string | undefined,
    courseId: string
  ): Promise<ICourse | null> {
    try {
      // const multerReq = req as any;
      const { chapterTitle, chapterDescription } = _chapterData ;         
      const chapterVideo = files?.find(
        (file: Express.Multer.File) => file.fieldname === "chapterVideo"
      );
      const chapterMaterial = files?.find(
        (file: Express.Multer.File) => file.fieldname === "chapterMaterial"
      );
      let chapterVideoURL: string | undefined;
      if (chapterVideo) {
        const chapterVideoParams: AWS.S3.PutObjectRequest = {
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: `courses/${title}/${chapterTitle}/chapterVideo`,
          Body: chapterVideo.buffer,
          ACL: "public-read",
          ContentType: chapterVideo.mimetype,
        };
        chapterVideoURL = await this._awsService.uploadToS3(chapterVideoParams);
      }

      let chapterMaterialURL: string | undefined;
      if (chapterMaterial) {
        const chapterMaterialParams: AWS.S3.PutObjectRequest = {
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: `courses/${title}/${chapterTitle}/material`,
          Body: chapterMaterial.buffer,
          ACL: "public-read",
          ContentType: chapterMaterial.mimetype,
        };
        chapterMaterialURL = await this._awsService.uploadToS3(
          chapterMaterialParams
        );
      }

      const chapterDetails = {
        chapterTitle,
        chapterDescription,
        courseId,
        chapterVideo: chapterVideoURL,
        chapterMaterial: chapterMaterialURL,
      };

      const chapterData = await this._courseRepository.createChapter(
        chapterDetails
      );

      return await this._courseRepository.addChapterToCourse(courseId!, {
        chapter: chapterData._id!,
        order,
      });
    } catch (error) {
      console.log(error,"create chapter error");
      
      throw Error;
    }
  }

  async getAllCourses(tutorId: string): Promise<ICourse[] | null> {
    try {
      return await this._courseRepository.getAllCourses(tutorId);
    } catch (error) {
      
      throw Error;
    }
  }

  async getCourseDetails(id: string): Promise<ICourse | null> {
    try {
      return await this._courseRepository.findCourseById(id);
    } catch (error) {
      throw Error;
    }
  }

  // update course
  async updateCourse(
    courseId: string,
    courseData: Partial<ICourse>,
    files: Express.Multer.File[]
  ): Promise<ICourse | null> {
    try {
      const {
        title,
        category,
        level,
        courseType,
        price,
        description,
        thumbnail: existingThumbnail,
        introductionVideo: existingIntroductionVideo,
      } = courseData;

      let updatedThumbnailURL: string | undefined = existingThumbnail;
      let updatedIntroductionVideoURL: string | undefined =
        existingIntroductionVideo;

      if (files && files.length > 0) {
        const thumbnailFile = files.find(
          (file) => file.fieldname === "thumbnail"
        );

        const introductionVideoFile = files.find(
          (file) => file.fieldname === "introductionVideo"
        );

        if (thumbnailFile) {
          const thumbnailParams: AWS.S3.PutObjectRequest = {
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: `courses/${title}/thumbnail`,
            Body: thumbnailFile.buffer,
            ACL: "public-read",
            ContentType: thumbnailFile.mimetype,
          };
          updatedThumbnailURL = await this._awsService.uploadToS3(
            thumbnailParams
          );
        }

        if (introductionVideoFile) {
          const introductionVideoParams: AWS.S3.PutObjectRequest = {
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: `courses/${title}/introductionVideo`,
            Body: introductionVideoFile.buffer,
            ACL: "public-read",
            ContentType: introductionVideoFile.mimetype,
          };
          updatedIntroductionVideoURL = await this._awsService.uploadToS3(
            introductionVideoParams
          );
        }
      }

      const updatedData: Partial<ICourse> = {
        title,
        category,
        level,
        courseType,
        price,
        description,
        thumbnail: updatedThumbnailURL,
        introductionVideo: updatedIntroductionVideoURL,
      };

      return await this._courseRepository.updateCourse(courseId, updatedData);
    } catch (error) {
      throw error;
    }
  }

  async updateChapter(
    id: string,
    chapterData: Partial<IChapter>,
    files: Express.Multer.File[],
    courseTitle: string
  ): Promise<IChapter | null> {
    const {
      chapterTitle,
      chapterDescription,
      chapterVideo: existingChapterVideo,
      chapterMaterial: existingChapterMaterial,
    } = chapterData;

    let updatedChapterVideo: string | undefined = existingChapterVideo;
    let updatedChapterMaterail: string | undefined = existingChapterMaterial;

    if (files && files.length > 0) {
      const chapterVideoFile = files.find(
        (file) => file.fieldname == "chapterVideo"
      );
      const chapterMaterialFile = files.find(
        (file) => file.fieldname == "chapterMaterial"
      );

      if (chapterVideoFile) {
        const chapterVideoParams: AWS.S3.PutObjectRequest = {
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: `courses/${courseTitle}/${chapterTitle}/chapterVideo`,
          Body: chapterVideoFile.buffer,
          ACL: "public-read",
          ContentType: chapterVideoFile.mimetype,
        };

        updatedChapterVideo = await this._awsService.uploadToS3(
          chapterVideoParams
        );
      }

      if (chapterMaterialFile) {
        const chapterMaterialParams: AWS.S3.PutObjectRequest = {
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: `courses/${courseTitle}/${chapterTitle}/chapterVideo`,
          Body: chapterMaterialFile.buffer,
          ACL: "public-read",
          ContentType: chapterMaterialFile.mimetype,
        };

        updatedChapterMaterail = await this._awsService.uploadToS3(
          chapterMaterialParams
        );
      }
    }

    const updateChapterData = {
      chapterTitle,
      chapterDescription,
      chapterVideo: updatedChapterVideo,
      chapterMaterial: updatedChapterMaterail,
    };

    return await this._courseRepository.updateChapter(id, updateChapterData);
  }

// fetching courses for students

 async getAllCourseForStudents(): Promise<ICourse[] | null> {
    return await  this._courseRepository.getCoursesForStudents()
 } 


//  make stripe payment checkout session
  async createCheckoutSession(courseId: string, userId: string): Promise<string> {
    try {
      
      const checkenrolled = await this._enrolledRepository.checkEnrolledCourse(userId,courseId);
      if(checkenrolled){
        if(checkenrolled?.status == true){
          throw new Error("Course already enrolled")
        }
      }
      const course = await this._courseRepository.findCourseById(courseId);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: course?.title as string,
              },
              unit_amount: parseInt(course?.price!) * 100,
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.CLIENT_URL}/user/payment-success?courseId=${course?._id}`,
        cancel_url: `${process.env.CLIENT_URL}/user/course-over-view/${course?._id}`,
      });     
      return session.id

    } catch (error) {
      throw Error
    }
      
  }

  async unlistCourse(courseId: string): Promise<ICourse | null> {
    try {

      return await this._courseRepository.unlistCourse(courseId)
      
    } catch (error) {
      throw error
    }
  }

  async listCourse(courseId: string): Promise<ICourse | null> {
    try {

      return await this._courseRepository.listCourse(courseId)
      
    } catch (error) {
      throw error
    }
  }

  async deleteChapterFromCourse(courseId: string, chapterId: string): Promise<ICourse | null> {
    try {

      return await this._courseRepository.deleteChapterFromCourse(courseId,chapterId);
      
    } catch (error) {
      throw error
    }
  }

  async enrollCourse(courseId: string, userId: string): Promise<IEnrolledCourse | null > {
    try {

      const checkenrolled = await this._enrolledRepository.checkEnrolledCourse(userId,courseId);
      if(checkenrolled){

        if(checkenrolled?.status == false){
          const enrolledData = await this._enrolledRepository.updateEnrolledCourseStatus(userId,courseId,true);
          await this._courseRepository.addEnrolledUserToCourse(
            courseId,
            userId
          );
          const courseData = await this._courseRepository.findCourseById(
            courseId
          );

          if(courseData?.courseType == "paid"){
            await this.handleTutorRevenue(courseData)
          }
          return enrolledData
        } else {
          throw new Error("Course Already enrolled")
        }
      }


      const courseData = await this._courseRepository.findCourseById(courseId);
      if(courseData){
        await this._userRepository.enrollCourse(userId, courseId);
        const enrollDetails = {
          courseId,
          userId,
          price: courseData?.price,
        };

        const enrolledCourse =
          await this._enrolledRepository.createEnrolledCourse(enrollDetails);

        if (courseData?.courseType === "paid") {
         this.handleTutorRevenue(courseData)
        }

       await this._courseRepository.addEnrolledUserToCourse(courseId,userId);

        return enrolledCourse;
      } else {
        throw new Error("Course is not found")
      }
      
    } catch (error) {
      throw error
    }

  }

  async handleTutorRevenue(courseData:ICourse){
    try {
       const tutorRevenue = Math.round(
         parseInt(courseData?.price) * (TUTOR_COURSE_PERCENTAGE / 100)
       );
       const description = `Course Enrollment revenue from ${courseData?.title}`;
       const transactionType = "Credited";

       const tutorId = courseData?.tutor;
       if (tutorId) {
         const existingWallet = await this._walletRepository.findWalletByUser(
           tutorId
         );

         if (!existingWallet) {
           const walletData = {
             userId: tutorId,
           };
           await this._walletRepository.createWallet(walletData);
         }
         const transactionsData = {
           amount: tutorRevenue,
           description,
           transactionType,
         };
         await this._walletRepository.addTransctionToWallet(
           tutorId,
           transactionsData
         );
       }
      
    } catch (error) {
      throw error
    }
  }

  async getEnrolledCoursesForUser(userId: string): Promise<IEnrolledCourse[] | null> {
    try {

      return await this._enrolledRepository.getAllEnrolledCourseForUser(userId);
      
    } catch (error) {
      throw error
    }
  }

  async cancelEnrolledCourse(userId:string , courseId: string): Promise<IEnrolledCourse | null >{
    try {

      await this._userRepository.removeCourseFromUser(userId,courseId);
      const courseData = await this._courseRepository.findCourseById(courseId);
      await this._courseRepository.removeUserFromCourse(courseId,userId)

      if(courseData?.courseType === "paid"){
        const tutorId = courseData?.tutor
        if(tutorId){
          const tutorRevenue =
            parseInt(courseData?.price) * (TUTOR_COURSE_PERCENTAGE / 100);
  
          const description = `Course Revenue Debited due to cancelation of ${courseData.title}`;
          const transactionType = "Debited"
  
          const transactionsData = {
            amount: -tutorRevenue,
            description,
            transactionType
          }
  
          await this._walletRepository.addTransctionToWallet(tutorId,transactionsData)
        }

        const existingWallet = await this._walletRepository.findWalletByUser(userId);
        
        if(!existingWallet){
          const walletData = {
            userId
          }
          await this._walletRepository.createWallet(walletData)
        }

        const courseAmount = parseInt(courseData.price);
        const studentDescription = `${courseData.title}'s price refunded due to cancelation of course`;
        const studentTransaction = "Credited" ;
        const studentTransactionsData ={
          amount: courseAmount,
          description: studentDescription,
          transactionType: studentTransaction
        }
        await this._walletRepository.addTransctionToWallet(userId, studentTransactionsData)      
      }
      return await this._enrolledRepository.updateEnrolledCourseStatus(userId,courseId,false)
    } catch (error) {
      throw error
    }
  }
}
