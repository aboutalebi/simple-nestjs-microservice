import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class EventListener {
  @EventPattern('user-created')
  getUserCreatedMessage(data: any) {
    console.log(`Hello ${data.name}`);
  }
}
