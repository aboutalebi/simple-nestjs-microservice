import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
config();

interface Config {
  rb_url: string;
  mailer_queue: string;
  sourceEmail: string;
}

@Injectable()
export class ConfigService {
  private config = {} as Config;
  constructor() {
    this.config.rb_url = process.env.RABBITMQ_URL || '';
    this.config.mailer_queue = process.env.RABBITMQ_MAILER_QUEUE || '';
    this.config.sourceEmail = process.env.SOURCE_EMAIL || '';
  }

  public get(key: keyof Config): any {
    return this.config[key];
  }
}
