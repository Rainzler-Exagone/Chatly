import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    SequelizeModule.forFeature([User]),
    JwtModule.register({ global: true, secret: process.env.secretKey }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
