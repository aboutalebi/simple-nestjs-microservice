import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
config();

interface Config {
  rb_url: string;
  users_queue: string;
  files_queue: string;
}

@Injectable()
export class ConfigService {
  private config = {} as Config;
  constructor() {
    this.config.rb_url = process.env.RABBITMQ_URL;
    this.config.users_queue = process.env.RABBITMQ_USERS_QUEUE;
    this.config.files_queue = process.env.RABBITMQ_FILES_QUEUE;
  }

  public get(key: keyof Config): any {
    return this.config[key];
  }
}
