import { Body, Controller, Post, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from 'src/Dtos/signup.dto';
import { RefreshTokenDto } from 'src/Dtos/refresh-token.dto';
import type { Request, Response } from 'express';

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
    const { refreshToken, accessToken, user } =
      await this.authService.login(LoginData);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { refreshToken, accessToken, user, message: 'success' };
  }

  @Post('refresh')
  async refreshToken(
    // @Body() refreshTokenDto: RefreshTokenDto
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken } = await this.authService.refreshToken(
      req.cookies.refreshToken,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return { refreshToken, message: 'success' };
  }

  @Post('logout')
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      return this.authService.logout(refreshTokenDto.token);
    } catch (error: any) {
      return { message: 'Logout failed', error: error.message };
    }
  }
}
