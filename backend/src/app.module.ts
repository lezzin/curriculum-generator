import { Module } from '@nestjs/common';
import { UserModule } from './modules/user.module';
import { AuthModule } from './modules/auth.module';
import { ConfigModule } from '@nestjs/config';
import { BaseDataModule } from './modules/base-data.module';
import { FreelanceModule } from './modules/freelance.module';
import { ResumeModule } from './modules/resume.module';
import { UserConfigModule } from './modules/user-config.module';
import { InfrastructureCacheModule } from './infrastructure/modules/cache.module';
import { AdminModule } from './modules/admin.module';
import { DatabaseModule } from './infrastructure/modules/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    BaseDataModule,
    FreelanceModule,
    ResumeModule,
    UserConfigModule,
    AdminModule,
    InfrastructureCacheModule,
    DatabaseModule,
  ],
})
export class AppModule { }
