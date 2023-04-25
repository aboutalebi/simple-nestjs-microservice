import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '../config/config.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule } from '../config/config.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DefaultIfEmptyInterceptor } from '../intercetors/default-empty-interceptor';

@Module({
  imports: [ConfigModule],
  providers: [
    UserService,
    {
      provide: APP_INTERCEPTOR,
      useClass: DefaultIfEmptyInterceptor,
    },
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
  ],
  controllers: [UserController],
})
export class UserModule {}
