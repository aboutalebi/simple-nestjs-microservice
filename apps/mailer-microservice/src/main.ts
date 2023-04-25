import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from './config/config.service';
import { Logger } from '@nestjs/common';
import { MailerModule } from './mailer.module';

async function bootstrap() {
  const configService = new ConfigService();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MailerModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [`${configService.get('rb_url')}`],
        queue: `${configService.get('mailer_queue')}`,
        queueOptions: { durable: true },
        prefetchCount: 1,
      },
    },
  );
  await app.listen();

  Logger.log(`🚀 Mailer is running`);
}
bootstrap();
