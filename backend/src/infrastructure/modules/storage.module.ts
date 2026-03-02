import { Module } from '@nestjs/common';
import { StorageRepository } from 'src/domain/repositories/storage.repository';
import { MinIOStorageService } from '../storage/minio-storage.service';

@Module({
  providers: [
    {
      provide: StorageRepository,
      useClass: MinIOStorageService,
    },
  ],
  exports: [StorageRepository],
})
export class StorageModule {}
