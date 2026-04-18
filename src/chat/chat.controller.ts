import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { GetConversationsDto } from 'src/Dtos/conversation.dto';
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
    const { receiverId, cipheredText, iv, authTage, objectKey, messageType } =
      MessageData;
    return this.chatService.sendMessage(
      senderId,
      receiverId,
      messageType,
      cipheredText,
      iv,
      objectKey,
      authTage,
    );
  }

  @UseGuards(AuthGuard)
  @Post('messages')
  getMessages(@Body() messageDto: getMessageDto, @Req() req) {
    const { conversationId, limit, before } = messageDto;
    return this.chatService.getMessages(conversationId, limit, before);
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
