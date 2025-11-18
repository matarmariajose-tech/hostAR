import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { config } from '@/config/config';
import { S3UploadResult, FileUpload } from '@/types';

export class S3Service {
    private s3: AWS.S3;

    constructor() {
        AWS.config.update({
            accessKeyId: config.aws.accessKeyId,
            secretAccessKey: config.aws.secretAccessKey,
            region: config.aws.region
        });

        this.s3 = new AWS.S3();
    }

    async uploadFile(file: Express.Multer.File, folder: string = ''): Promise<S3UploadResult> {
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

        const uploadParams = {
            Bucket: config.aws.s3Bucket,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read'
        };

        try {
            const result = await this.s3.upload(uploadParams).promise();

            return {
                url: result.Location,
                key: result.Key,
                bucket: result.Bucket
            };
        } catch (error) {
            throw new Error(`Failed to upload file: ${error}`);
        }
    }

    async deleteFile(key: string): Promise<void> {
        const deleteParams = {
            Bucket: config.aws.s3Bucket,
            Key: key
        };

        try {
            await this.s3.deleteObject(deleteParams).promise();
        } catch (error) {
            throw new Error(`Failed to delete file: ${error}`);
        }
    }

    async deleteFiles(keys: string[]): Promise<void> {
        if (keys.length === 0) return;

        const deleteParams = {
            Bucket: config.aws.s3Bucket,
            Delete: {
                Objects: keys.map(key => ({ Key: key }))
            }
        };

        try {
            await this.s3.deleteObjects(deleteParams).promise();
        } catch (error) {
            throw new Error(`Failed to delete files: ${error}`);
        }
    }
}