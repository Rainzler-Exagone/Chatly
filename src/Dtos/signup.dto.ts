import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])(?=.*[a-zA-Z])/, {
    message:
      'Password must be at least 6 characters long and contain both letters and numbers',
  })
  password!: string;
}
