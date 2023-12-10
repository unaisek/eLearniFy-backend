import { rejects } from 'assert';
import { S3 } from 'aws-sdk';
import dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config()

interface S3UploadParams extends S3.PutObjectRequest {}

interface AwsS3ServiceInterface{
    uploadToS3(params: S3UploadParams): Promise<string>;
}

class AwsS3Service implements AwsS3ServiceInterface{
    private _s3:S3;

    constructor() {
        this._s3 = new S3({
          accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
          region: process.env.AWS_S3_REGION!,
        });
    }

    uploadToS3(params: S3UploadParams): Promise<string> {
        return new Promise((resolve,reject)=>{
            this._s3.upload(params,(err,data)=>{
                if(err){
                    reject(err)
                } else{
                    if(data && data.Location){
                        resolve(data.Location)
                    } else {
                        reject(new Error('Unable to ger URL'))
                    }
                }
            });
        });
        
    }
}

export default AwsS3Service;