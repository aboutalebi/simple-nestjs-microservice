import { Model } from 'mongoose';
import { User, UserEmail } from '../domain';
import { UserMap } from '../mappers/user.map';
import { InjectModel } from '@nestjs/mongoose';
import { IUserEntity } from './user.entity';
import { Injectable } from '@nestjs/common';

export interface IUserRepo<T> {
  findById(id: string): Promise<T>;
  exists(email: UserEmail): Promise<boolean>;
  create(user: T): Promise<T>;
}

@Injectable()
export class UserRepo implements IUserRepo<User> {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUserEntity>,
  ) {}

  public async findById(id: string): Promise<User> {
    const userData = await this.userModel.findById(id);

    if (!!userData === true) {
      const userOrError = User.create({
        emailAddress: userData.emailAddress,
        name: userData.name,
        familyName: userData.familyName,
        isEmailVerified: false,
      });

      if (userOrError.isFailure) {
        return null;
      }

      return userOrError.getValue();
    } else {
      return null;
    }
  }

  public async exists(email: UserEmail): Promise<boolean> {
    const user = await this.userModel
      .findOne({ emailAddress: email.value.toString() })
      .exec();
    return !!user === true;
  }

  public async create(user: User): Promise<User> {
    const exists = await this.exists(user.emailAddress);
    const rawUser = UserMap.toPersistence(user);

    try {
      if (!exists) {
        await this.userModel.create(rawUser);
        return user;
      }
    } catch (err) {
      console.log(err);
    }
  }
}
