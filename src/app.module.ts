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
import { setupAssociations } from './models/relationships';
import { User } from './models/users.model';
import { Conversation } from './models/conversation.model';
import { Message } from './models/message.model';
import { ConversationParticipant } from './models/conversation-participant.model';
import { MessageRead } from './models/message-read.model';
import { RefreshToken } from './models/refresh-token.model';
import { ChatModule } from './chat/chat.module';
import { MinioModule } from './minio/minio.module';

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
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        autoLoadModels: false,
        models: [
          User,
          Conversation,
          Message,
          ConversationParticipant,
          MessageRead,
          RefreshToken,
        ],
        // models: [User, Message, Conversation, ConversationParticipant],
        // synchronize: true, // Note: Set to false in production
      }),
    }),
    MinioModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseTestService],
})
export class AppModule {
  onModuleInit() {
    setupAssociations(); // ✅ runs after models are initialized
  }
}
