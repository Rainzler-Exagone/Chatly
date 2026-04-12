import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConversationParticipant } from 'src/models/conversation-participant.model';
import { Conversation } from 'src/models/conversation.model';
import { Message } from 'src/models/message.model';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { User } from 'src/models/users.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Message,
      Conversation,
      ConversationParticipant,
      User,
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService], // Gateway optional
  exports: [ChatService], // export if other modules need it
})
export class ChatModule {}
