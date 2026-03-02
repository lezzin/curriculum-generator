import Stream from 'node:stream';

export abstract class StorageRepository {
  abstract uploadFile(
    bucket: string,
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string,
  ): Promise<void>;
  abstract getFile(bucket: string, fileName: string): Promise<Stream.Readable>;
  abstract hasFile(bucket: string, fileName: string): Promise<boolean>;
  abstract removeFile(bucket: string, fileName: string): Promise<void>;
  abstract createBucket(bucket: string): Promise<void>;
}
