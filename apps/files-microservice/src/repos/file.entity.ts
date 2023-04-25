import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FileDomain } from '../domain';

@Schema()
export class FileDocument extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ default: Date.now() })
  createdDate: Date;
}

export const FileSchema = SchemaFactory.createForClass(FileDocument);
export type IFileEntity = Omit<FileDomain, '_id'>;
