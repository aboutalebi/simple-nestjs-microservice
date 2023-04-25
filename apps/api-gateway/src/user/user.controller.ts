import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO } from '@payever-microservices/shared/dtos/create-user.dto';
import { UserService } from './user.service';
import { GrpcToHttpInterceptor } from '../intercetors/grpc-to-http.interceptor';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/users')
  @UseInterceptors(GrpcToHttpInterceptor)
  async createUser(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.createUser(createUserDTO);
  }

  @Get('/user/:userID')
  @UseInterceptors(GrpcToHttpInterceptor)
  async getUser(@Param('userID') userID: number) {
    return this.userService.getUser(userID);
  }

  @Get('/user/:userID/avatar')
  @UseInterceptors(GrpcToHttpInterceptor)
  async getUserAvatar(@Param('userID') userID: string) {
    return this.userService.getUserAvatar(userID);
  }

  @Delete('/user/:userID/avatar')
  @UseInterceptors(GrpcToHttpInterceptor)
  async deleteUserAvatar(@Param('userID') userID: string) {
    return this.userService.deleteUserAvatar(userID);
  }
}
