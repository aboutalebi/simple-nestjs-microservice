import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from './config/config.service';
import { Logger } from '@nestjs/common';
import { FilesModule } from './files.module';

async function bootstrap() {
  const app = await NestFactory.create(FilesModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const configService = new ConfigService();

  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`${configService.get('rb_url')}`],
      queue: `${configService.get('files_queue')}`,
      queueOptions: { durable: true },
      prefetchCount: 1,
    },
  });

  await app.startAllMicroservices();

  await app.listen(3331);

  Logger.log(`🚀 Files is running`);
}
bootstrap();
