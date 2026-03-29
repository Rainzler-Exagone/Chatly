import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from 'src/Dtos/signup.dto';
import { RefreshTokenDto } from 'src/Dtos/refresh-token.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //TODO: Implement signup endpoint
  @Post('signup')
  signUp(@Body() SignupData: SignupDto) {
    return this.authService.signup(SignupData);
  }

  @Post('login')
  async Login(
    @Body() LoginData: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, accessToken } =
      await this.authService.login(LoginData);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { refreshToken, accessToken, message: 'success' };

    // Store refresh token in HttpOnly cookie

    // res.cookie('refreshToken', refreshToken, {
    //   httpOnly: true,
    //   secure: false, // true in production (HTTPS)
    //   sameSite: 'strict',
    //   path: '/',
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });
  }

  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.token);
  }
}
