import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly familyName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly emailAddress: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
