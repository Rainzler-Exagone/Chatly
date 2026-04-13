import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  conversationDto,
  GetConversationsDto,
} from 'src/Dtos/conversation.dto';
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
  @Get('conversations')
  async getConversation(
    @Body() ConversationDto: GetConversationsDto,
    @Req() req,
  ) {
    const userId = req.userId;
    return this.chatService.getConversations(userId, ConversationDto);
  }
  @UseGuards(AuthGuard)
  @Post('conversations')
  async createConversation(
    @Body() ConversationDto: GetConversationsDto,
    @Req() req,
  ) {
    const userId = req.userId;
    return this.chatService.getConversations(userId, ConversationDto);
  }
}
