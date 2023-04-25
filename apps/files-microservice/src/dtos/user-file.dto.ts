import { IsNotEmpty, IsString } from 'class-validator';

export class UserFileDTO {
  @IsString()
  @IsNotEmpty()
  readonly userID: string;

  @IsString()
  @IsNotEmpty()
  readonly type: string;
}
