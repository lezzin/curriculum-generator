import { Module } from '@nestjs/common';
import { UserModule } from './modules/user.module';
import { AuthModule } from './modules/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseDataModule } from './modules/base-data.module';
import { FreelanceModule } from './modules/freelance.module';
import { ResumeModule } from './modules/resume.module';
import { UserConfigModule } from './modules/user-config.module';
import { InfrastructureCacheModule } from './infrastructure/modules/cache.module';
import { AdminModule } from './modules/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST'),
        port: Number(config.get<number>('DATABASE_PORT')),
        username: config.get<string>('DATABASE_USER'),
        password: config.get<string>('DATABASE_PASSWORD'),
        database: config.get<string>('DATABASE_DB'),
        synchronize: false,
        //quando setado como true faz um drop no database inteiro
        dropSchema: false,
        logging: false,
        entities: ['dist/**/entities/*.entity.js'],
      }),
    }),
    UserModule,
    AuthModule,
    BaseDataModule,
    FreelanceModule,
    ResumeModule,
    UserConfigModule,
    AdminModule,
    InfrastructureCacheModule,
  ],
})
export class AppModule { }
