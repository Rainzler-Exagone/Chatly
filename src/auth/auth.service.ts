import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from 'src/Dtos/signup.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/users.model';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/Dtos/login.dto';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from 'src/models/refresh-token.model';
import { Op } from 'sequelize';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(RefreshToken) private refreshTokenModel: typeof RefreshToken,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

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

    return { message: 'User created successfully' };
  }

  async login(loginData: LoginDto) {
    const { username, password } = loginData;
    console.log(username, password);
    const user = await this.userModel.findOne({
      where: { name: username },
    });
    if (!user) {
      throw new UnauthorizedException('user doesn`t exist');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateUserTokens(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar ?? null,
        email: user.email ?? null,
      },
      ...tokens,
    };
  }

  async generateUserTokens(userId: any) {
    //access token
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '1h' });

    //refresh token
    const refreshToken = uuidv4();
    await this.saveRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }

  async saveRefreshToken(userId: number, refreshToken: string) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);
    const token = await this.refreshTokenModel.findOne({
      where: { userId },
    });
    if (token) {
      await token.update({ token: refreshToken, expiryDate });
    } else {
      await this.refreshTokenModel.create({
        token: refreshToken,
        userId,
        expiryDate,
      });
    }
  }

  //Post refresh token to generate new access token
  async refreshToken(refreshToken: string) {
    const storedToken = await this.refreshTokenModel.findOne({
      where: { token: refreshToken, expiryDate: { [Op.gt]: new Date() } },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Token has expired or doesn`t exist ');
    }
    return this.generateUserTokens(storedToken.userId);
  }

  async logout(refreshToken: string) {
    const token = await this.refreshTokenModel.findOne({
      where: { token: refreshToken },
    });

    if (token) {
      await token.destroy();
      return { message: 'Logged out successfully' };
    }
  }
}
