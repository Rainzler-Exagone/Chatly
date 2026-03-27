import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from 'src/Dtos/signup.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/Dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async signup(signupDto: SignupDto) {
    const { name, email, password } = signupDto;
    // Check if the user already exists

    const existingUser = await this.userModel.findOne({
      where: { email: email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //Create user and save in postgresql

    await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  }

  async login(loginData: LoginDto) {
    const { email, password } = loginData;

    const user = await this.userModel.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    //Generate JWT token

    return { message: 'success' };
  }
}
