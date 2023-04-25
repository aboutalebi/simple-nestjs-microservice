import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '../domain/user';
import { IMailPayload } from '@payever-microservices/shared/interfaces/mail-payload.interface';

@Injectable()
export class UserCreatedEvent {
  constructor(
    @Inject('USERS_MICROSERVICE') private client: ClientProxy,
    @Inject('MAILER_MICROSERVICE') private mailerClient: ClientProxy,
  ) {}

  async emit(userInfo: User) {
    this.client.emit('user-created', {
      name: userInfo.name,
      familyName: userInfo.familyName,
      emailAddress: userInfo.emailAddress.value,
    });

    const payload: IMailPayload = {
      template: 'WELCOME',
      payload: {
        emails: [userInfo.emailAddress.value],
        data: {
          firstName: userInfo.name,
          lastName: userInfo.familyName,
        },
        subject: 'ٌWelcome!',
      },
    };

    this.mailerClient.emit('send_email', payload);

    console.log(`Emit User Event: UserCreated, ${userInfo.emailAddress.value}`);
  }
}
