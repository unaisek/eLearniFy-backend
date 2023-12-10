import AwsS3Service from "./AwsService";
import { ICourseService } from "./interfaces/ICourseService";
import { Request } from 'express';
import dotenv from 'dotenv';
import CourseRepository from "../repositories/CourseRepository";
import { ICourse } from "../models/Course";
dotenv.config();
// interface customRequest extends Request  {
//     File?.Express.Multer.File[]
// }

export default class CourseService implements ICourseService{

    private _awsService:AwsS3Service;
    private _courseRepository: CourseRepository;
    constructor(){
        this._awsService = new AwsS3Service();
        this._courseRepository = new CourseRepository();
    }
    async  addNewCourse(req: Request): Promise<ICourse | null> {
        try {
            
            const multerReq = req as any
            // console.log(multerReq.body);
                
            const { title, category,level, courseType, price, description, tutorId } = req.body;
            const thumbnail = multerReq.files?.find((file:Express.Multer.File) => file.fieldname === 'thumbnail');
            const introductionVideo = multerReq.files?.find((file:Express.Multer.File)=> file.fieldname ==='introductionVideo')

            let thumbnailURL :string | undefined;
            if(thumbnail){
                const thumbnailParams: AWS.S3.PutObjectRequest = {
                Bucket: process.env.AWS_S3_BUCKET_NAME!,
                Key :`courses/${title}/${thumbnail.originalname}`,
                Body: thumbnail.buffer,
                ACL : 'public-read',
                ContentType: thumbnail.mimetype
                };
                thumbnailURL = await this._awsService.uploadToS3(thumbnailParams);
                console.log(thumbnailURL,"url");
                
            }

            let introductionVideoURL: string | undefined;
            if (introductionVideo) {
            const introductionVideoParams: AWS.S3.PutObjectRequest = {
                Bucket: process.env.AWS_S3_BUCKET_NAME!,
                Key: `courses/${title}/${introductionVideo.originalname}`,
                Body: introductionVideo.buffer,
                ACL: "public-read",
                ContentType: introductionVideo.mimetype,
            };
                introductionVideoURL = await this._awsService.uploadToS3(introductionVideoParams);
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
            thumbnail:thumbnailURL,
            introductionVideo:introductionVideoURL
            };
            
           return await this._courseRepository.createCourse(courseData)
            
        } catch (error) {
            throw Error
        }
    }

    async createChapter(req:Request, order:number,title:string | undefined,courseId: string):Promise<any>{
        const multerReq = req as any;
        const { chapterTitle, chapterDescription} = multerReq.body
        const chapterVideo = multerReq.files?.find((file:Express.Multer.File)=> file.fieldname ==='chapterVideo');
        const chapterMaterial = multerReq.files?.find((file:Express.Multer.File)=> file.fieldname ==='chapterMaterial');
          let chapterVideoURL: string | undefined;
          if (chapterVideo) {
            const chapterVideoParams: AWS.S3.PutObjectRequest = {
              Bucket: process.env.AWS_S3_BUCKET_NAME!,
              Key: `courses/${title}/${chapterVideo.originalname}`,
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
               Key: `courses/${title}/${chapterMaterial.originalname}`,
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

           const chapterData = await this._courseRepository.createChapter(chapterDetails);
           
           await this._courseRepository.addChapterToCourse(courseId!,{chapter:chapterData._id!,order});

    }
}
