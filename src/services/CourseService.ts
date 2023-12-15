import AwsS3Service from "./AwsService";
import { ICourseService } from "./interfaces/ICourseService";
import { Request } from 'express';
import dotenv from 'dotenv';
import CourseRepository from "../repositories/CourseRepository";
import { ICourse } from "../models/Course";
import { title } from "process";
import { IChapter } from "../models/Chapter";
dotenv.config();
// interface customRequest extends Request  {
//     File?.Express.Multer.File[]
// }

export default class CourseService implements ICourseService {
  private _awsService: AwsS3Service;
  private _courseRepository: CourseRepository;
  constructor() {
    this._awsService = new AwsS3Service();
    this._courseRepository = new CourseRepository();
  }
  async addNewCourse(req: Request): Promise<Partial<ICourse> | null> {
    try {
      const multerReq = req as any;
      // console.log(multerReq.body);

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
        console.log(thumbnailURL, "url");
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
        console.log(introductionVideoURL, "url");
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
    req: Request,
    order: number,
    title: string | undefined,
    courseId: string
  ): Promise<ICourse | null> {
    try {
      const multerReq = req as any;
      const { chapterTitle, chapterDescription } = multerReq.body;
      const chapterVideo = multerReq.files?.find(
        (file: Express.Multer.File) => file.fieldname === "chapterVideo"
      );
      const chapterMaterial = multerReq.files?.find(
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
        console.log(chapterVideoURL, "url");
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
        console.log(chapterMaterialURL, "url");
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

  // async updateCourse(courseId:string,corseData:Partial<ICourse>,files:Express.Multer.File[] | undefined):Promise<ICourse | null> {
  //   try {
  //       const {
  //         title,
  //         category,
  //         level,
  //         courseType,
  //         price,
  //         description,
  //         thumbnail,
  //         introductionVideo
  //       } = corseData;

  //       if(files && files.length > 0 ){
  //         console.log(files);

  //         const uploadedThumbnail = files.find(file => file.fieldname === 'thumbnail');
  //         const uploadedIntroductionVideo = files.find(file => file.fieldname === 'introductionVideo');
  //         let updatedThumbnailURL: string | undefined;
  //         if (uploadedThumbnail) {
  //           const thumbnailParams: AWS.S3.PutObjectRequest = {
  //             Bucket: process.env.AWS_S3_BUCKET_NAME!,
  //             Key: `courses/${title}/thumbnail`,
  //             Body: uploadedThumbnail.buffer,
  //             ACL: "public-read",
  //             ContentType: uploadedThumbnail.mimetype,
  //           };
  //           updatedThumbnailURL = await this._awsService.uploadToS3(
  //             thumbnailParams
  //           );
  //         }

  //         let updatedIntroductionVideoURL: string | undefined;
  //         if (uploadedIntroductionVideo) {
  //           const introductionVideoParams: AWS.S3.PutObjectRequest = {
  //             Bucket: process.env.AWS_S3_BUCKET_NAME!,
  //             Key: `courses/${title}/introductionVideo`,
  //             Body: uploadedIntroductionVideo.buffer,
  //             ACL: "public-read",
  //             ContentType: uploadedIntroductionVideo.mimetype,
  //           };
  //           updatedIntroductionVideoURL = await this._awsService.uploadToS3(
  //             introductionVideoParams
  //           );
  //         }

  //         const updatedData = {
  //           title,
  //           category,
  //           level,
  //           courseType,
  //           price,
  //           description,
  //           thumbnail:updatedThumbnailURL,
  //           introductionVideo:updatedIntroductionVideoURL,
  //         };

  //         return await this._courseRepository.updateCourse(courseId,updatedData);

  //       }

  //       const updatedData = {
  //         title,
  //         category,
  //         level,
  //         courseType,
  //         price,
  //         description,
  //         thumbnail,
  //         introductionVideo,
  //       };

  //       return await this._courseRepository.updateCourse(courseId,updatedData);

  //   } catch (error) {
  //     throw Error;
  //   }
  // }
  async updateCourse(courseId: string, courseData: Partial<ICourse>, files: Express.Multer.File[]): Promise<ICourse | null> {
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
      let updatedIntroductionVideoURL: string | undefined = existingIntroductionVideo;

      if (files && files.length > 0) {
        const thumbnailFile = files.find(
          (file) => file.fieldname === "thumbnail"
        );
        console.log(thumbnailFile,"image file");
        
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
          console.log(updatedThumbnailURL);
          
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
}
