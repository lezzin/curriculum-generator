import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
    private minioClient: Minio.Client;

    constructor(
        private readonly configService: ConfigService,
    ) { }

    onModuleInit() {
        this.minioClient = new Minio.Client({
            endPoint: this.configService.getOrThrow<string>('MINIO_ENDPOINT'),
            port: this.configService.getOrThrow<number>('MINIO_PORT') || 9000,
            accessKey: this.configService.getOrThrow<string>('MINIO_ACCESS_KEY'),
            secretKey: this.configService.getOrThrow<string>('MINIO_SECRET_KEY'),
            useSSL: this.configService.getOrThrow<string>('MINIO_USE_SSL') == 'true',
        });
    }

    async uploadFile(
        bucket: string,
        fileName: string,
        fileBuffer: Buffer,
        mimeType: string,
    ) {
        await this.minioClient.putObject(bucket, fileName, fileBuffer, fileBuffer.length, {
            'Content-Type': mimeType,
        });
    }

    async getFile(bucket: string, fileName: string) {
        return this.minioClient.getObject(bucket, fileName);
    }

    async hasFile(bucket: string, fileName: string): Promise<boolean> {
        try {
            await this.minioClient.statObject(bucket, fileName);
            return true;
        } catch (err) {
            if (err.code === 'NotFound') {
                return false;
            }
            throw err;
        }
    }

    async getPresignedUrl(bucket: string, fileName: string) {
        return this.minioClient.presignedGetObject(bucket, fileName, 60 * 60);
    }

    async createBucket(bucket: string) {
        const exists = await this.minioClient.bucketExists(bucket);

        if (!exists) {
            await this.minioClient.makeBucket(bucket, 'us-east-1');
        }
    }
}