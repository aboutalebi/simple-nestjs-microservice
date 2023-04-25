import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
config();

interface Config {
  mongodb_uri: string;
  rb_url: string;
  files_queue: string;
}

@Injectable()
export class ConfigService {
  private config = {} as Config;
  constructor() {
    this.config.mongodb_uri = process.env.MONGODB_URI;
    this.config.rb_url = process.env.RABBITMQ_URL;
    this.config.files_queue = process.env.RABBITMQ_FILES_QUEUE;
  }

  public get(key: keyof Config): any {
    return this.config[key];
  }
}
