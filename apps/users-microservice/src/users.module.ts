import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { EventListener } from './event-listener';
import { CreateUserController } from './useCases/createUser/create-user.controller';
import { CreateUserUseCase } from './useCases/createUser/create-user.useCase';
import { UserRepositoryModule } from './repos/user-repository.module';
import { UserCreatedEvent } from './events/user-created.event';
import { ConfigService } from './config/config.service';
import { ConfigModule } from './config/config.module';
import { GetUserController } from './useCases/getUserInfo/get-user.controller';
import { GetUserUseCase } from './useCases/getUserInfo/get-user.useCase';
import { GetAvatarController } from './useCases/getAvatar/get-avatar.controller';
import { GetAvatarUseCase } from './useCases/getAvatar/get-avatar.useCase';
import { DeleteAvatarController } from './useCases/deleteAvatar/delete-avatar.controller';
import { DeleteAvatarUseCase } from './useCases/deleteAvatar/delete-avatar.useCase';

@Module({
  imports: [
    ConfigModule,
    UserRepositoryModule,
    HttpModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('mongodb_uri'),
      }),
      inject: [ConfigService],
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './public',
        filename: (req, file, cb) => {
          const ext = file.mimetype.split('/')[1];
          cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
        },
      }),
    }),
  ],

  controllers: [
    CreateUserController,
    GetUserController,
    GetAvatarController,
    DeleteAvatarController,
    EventListener,
  ],
  providers: [
    CreateUserUseCase,
    GetUserUseCase,
    GetAvatarUseCase,
    DeleteAvatarUseCase,
    UserCreatedEvent,
    {
      provide: 'USERS_MICROSERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`${configService.get('rb_url')}`],
            queue: `${configService.get('users_queue')}`,
            queueOptions: {
              durable: true,
            },
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'MAILER_MICROSERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`${configService.get('rb_url')}`],
            queue: `${configService.get('mailer_queue')}`,
            queueOptions: {
              durable: true,
            },
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'FILES_MICROSERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`${configService.get('rb_url')}`],
            queue: `${configService.get('files_queue')}`,
            queueOptions: {
              durable: true,
            },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class UsersModule {}
