import { Controller } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @EventPattern('send_email')
  public sendEmailController(@Payload() data): void {
    this.mailerService.sendEmail(data);
  }
}
