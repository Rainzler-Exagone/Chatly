import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  // @IsEmail()
  // email!: string;
  @IsString()
  declare username: string;

  @IsString()
  declare password: string;
}
