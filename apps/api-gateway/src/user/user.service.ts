import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDTO } from '@payever-microservices/shared/dtos/create-user.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @Inject('USERS_MICROSERVICE') private readonly usersClient: ClientProxy,
  ) {}

  async createUser(createUserDTO: CreateUserDTO) {
    return await firstValueFrom(
      this.usersClient.send('create_user', createUserDTO),
    );
  }

  async getUser(userID: number) {
    return await firstValueFrom(this.usersClient.send('get_user', userID));
  }

  async getUserAvatar(userID: string) {
    return await firstValueFrom(
      this.usersClient.send('get_user_avatar', userID),
    );
  }

  async deleteUserAvatar(userID: string) {
    return await firstValueFrom(
      this.usersClient.send('delete_user_avatar', userID),
    );
  }
}
