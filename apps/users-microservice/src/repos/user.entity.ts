import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../domain';

@Schema()
export class UserDocument extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  familyName: string;

  @Prop({ required: true, unique: true, lowercase: true })
  emailAddress: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: Date.now() })
  createdDate: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
export type IUserEntity = Omit<User, '_id'>;
