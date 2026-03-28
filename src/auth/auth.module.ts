import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models/users.model';
import { JwtModule } from '@nestjs/jwt';
import { RefreshToken } from 'src/models/refresh-token.model';

@Module({
  imports: [UsersModule, SequelizeModule.forFeature([User, RefreshToken])],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
