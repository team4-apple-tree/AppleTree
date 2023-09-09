import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  private readonly s3: AWS.S3;
  private readonly S3_BUCKET_NAME: string;

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
    this.S3_BUCKET_NAME = this.configService.get<string>('AWS_S3_BUCKET_NAME');
  }

  async uploadImageToS3(
    file: Express.Multer.File,
    folderName: string,
    fileName: string,
  ): Promise<string> {
    const params = {
      Bucket: this.S3_BUCKET_NAME,
      Key: `${folderName}/${fileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const result = await this.s3.upload(params).promise();

    return result.Location;
  }
}
