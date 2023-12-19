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
    _chapterData:Partial<IChapter>,
    files: Express.Multer.File[],
    order: number,
    title: string | undefined,
    courseId: string
  ): Promise<ICourse | null> {
    try {
      // const multerReq = req as any;
      const { chapterTitle, chapterDescription } = _chapterData ;
      console.log(chapterTitle,chapterDescription,"chapter req");
      console.log(courseId,"couseId");
      
      
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
        console.log(thumbnailFile, "image file");

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

  // add new Chapter To existing course

  // async addNewChapterToCourse(
  //     courseId: string, 
  //     chapterData: Partial<IChapter>, 
  //     files: Express.Multer.File[],
  //     order:number,
  //     courseTitle: string
  //   ): Promise<any> {
  //     try {

  //       const {chapterTitle, chapterDescription} = chapterData;
        
  //     } catch (error) {
  //       throw Error
  //     }
  // }
}