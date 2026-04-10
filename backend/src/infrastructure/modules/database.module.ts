import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
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
                entities: [__dirname + '/../**/entities/*.entity{.ts,.js}']
            }),
        }),
    ],
})
export class DatabaseModule { }
