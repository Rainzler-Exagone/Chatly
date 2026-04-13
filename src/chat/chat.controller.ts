import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { conversationDto } from 'src/Dtos/conversation.dto';
import { createMessageDto, getMessageDto } from 'src/Dtos/message.dto';
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

  @UseGuards(AuthGuard)
  @Get('messages')
  getMessages(@Body() messageDto: getMessageDto, @Req() req) {
    const { receiverId, limit, before } = messageDto;
    const senderId = req.userId;
    console.log(senderId);
    return this.chatService.getMessages(senderId, receiverId, limit, before);
  }

  @UseGuards(AuthGuard)
  @Post('conversations')
  async creatConversation(
    @Body() ConversationDto: conversationDto,
    @Req() req,
  ) {
    return;
  }
}
