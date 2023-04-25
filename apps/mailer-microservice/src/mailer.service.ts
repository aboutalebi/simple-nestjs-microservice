import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  public async sendEmail(data): Promise<void> {
    const { template, payload } = data;

    this.logger.log(
      `🚀 Email Send To: ${payload.emails}; Template: ${template}`,
    );
  }
}
