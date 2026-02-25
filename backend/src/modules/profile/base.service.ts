import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MinioService } from 'src/modules/minio/minio.service';
import { UserBaseEntity } from './entities/user-base.entity';
import { BaseType } from './enum/base-type.enum';

@Injectable()
export class BaseService {
  private readonly logger = new Logger(BaseService.name)
  private readonly BUCKET_NAME = 'base-content'

  constructor(
    @InjectRepository(UserBaseEntity)
    private readonly userBaseRepository: Repository<UserBaseEntity>,
    private readonly minioService: MinioService,
  ) { }

  async create(description: string, type: BaseType, userId: string) {
    try {

      await this.userBaseRepository.upsert(
        {
          userId: userId,
          description: description,
          type: type
        },
        ["userId", "type"]
      );

      const fileName = this.getFilename(type, userId)

      await this.minioService.createBucket(this.BUCKET_NAME);
      const buffer = Buffer.from(description);
      await this.minioService.uploadFile(this.BUCKET_NAME, fileName, buffer, 'text/plain');

      return { message: 'Dado base adicionado/atualizado com sucesso!' };
    } catch (err) {
      this.logger.error('Failed to upsert base data', err);
      throw err;
    }
  }

  async remove(type: BaseType, userId: string) {
    try {
      const fileName = this.getFilename(type, userId)
      await this.minioService.removeObject(this.BUCKET_NAME, fileName);
      await this.userBaseRepository.delete({ userId });

      return { message: 'Dado base removido com sucesso!' };
    } catch (err) {
      this.logger.error('Failed to remove base data', err);
      throw err;
    }
  }

  async getAll(userId: string) {
    return await Promise.all(
      Object.values(BaseType).map(async (type) => {
        const filename = this.getFilename(type, userId)

        try {
          const stream = await this.minioService.getObject(
            this.BUCKET_NAME,
            filename,
          )

          const content = await this.minioService.streamToString(stream)

          return {
            type,
            data: content,
          }
        } catch (error) {
          return {
            type,
            data: null
          }
        }
      }),
    )
  }

  getFilename(type: BaseType, userId: string) {
    return `${type}-${userId}.txt`;
  }
}
