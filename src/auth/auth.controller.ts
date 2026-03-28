import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from 'src/Dtos/signup.dto';
import { RefreshTokenDto } from 'src/Dtos/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //TODO: Implement signup endpoint
  @Post('signup')
  signUp(@Body() SignupData: SignupDto) {
    return this.authService.signup(SignupData);
  }

  @Post('login')
  Login(@Body() LoginData: any) {
    return this.authService.login(LoginData);
  }

  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.token);
  }
}
