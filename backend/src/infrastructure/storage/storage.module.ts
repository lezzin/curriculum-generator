import { Module } from '@nestjs/common';
import { StorageRepository } from 'src/domain/repositories/storage.repository';
import { MinIOStorageService } from './minio-storage.service';

@Module({
    providers: [
        {
            provide: StorageRepository,
            useClass: MinIOStorageService,
        },
    ],
    exports: [StorageRepository],
})
export class StorageModule { }