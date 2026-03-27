import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewayModule } from './gateway/gateway.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseTestService } from './db.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import config from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [config],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
      }),
      global: true,
    }),
    GatewayModule,
    AuthModule,
    UsersModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
      username: process.env.DB_USERNAME,
      password: String(process.env.DB_PASSWORD),
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: true, // Note: Set to false in production
    }),
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseTestService],
})
export class AppModule {}
