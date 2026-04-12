import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { conversationDto } from 'src/Dtos/conversation.dto';
import { createMessageDto } from 'src/Dtos/message.dto';
import { ChatService } from './chat.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @UseGuards(AuthGuard)
  @Post('message')
  newMessage(@Body() MessageData: createMessageDto, @Req() req) {
    const senderId: string = req.userId;
    const { receiverId, content, messageType } = MessageData;
    return this.chatService.sendMessage(
      senderId,
      receiverId,
      content,
      messageType,
    );
  }

  //   @Post('conversation')
  //   async creatConversation(
  //     @Body() ConversationDto: conversationDto,
  //     @Req() req,
  //   ) {}
}
