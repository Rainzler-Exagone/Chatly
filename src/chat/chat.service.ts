import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { conversationDto } from 'src/Dtos/conversation.dto';
import { ConversationParticipant } from 'src/models/conversation-participant.model';
import { Conversation } from 'src/models/conversation.model';
import { Message } from 'src/models/message.model';
import { User } from 'src/models/users.model';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Conversation) private ConversationModel: typeof Conversation,
    @InjectModel(Message) private MessageModel: typeof Message,
    @InjectModel(User) private UserModel: typeof User,
    @InjectModel(ConversationParticipant)
    private ConversationParticipantModel: typeof ConversationParticipant,
    private sequelize: Sequelize,
  ) {}

  async findConversationBetweenUsers(senderId: string, receiverId: string) {
    const directKey = [senderId, receiverId].sort().join(':');
    console.log(directKey);
    return await this.ConversationModel.findOne({
      where: {
        directKey,
        type: 'direct',
      },
    });
  }

  async sendMessage(
    senderId: string,
    receiverId: string,
    content: string,
    messageType: string,
  ) {
    let conversation;

    conversation = await this.findConversationBetweenUsers(
      senderId,
      receiverId,
    );
    const directKey = [senderId, receiverId].sort().join(':');

    if (!conversation) {
      const receiver = await this.UserModel.findByPk(receiverId, {
        attributes: ['id', 'name'],
      });
      const title =
        receiver?.name && receiver?.name
          ? `${receiver.name} ${receiver.name}`
          : receiver?.name || 'User';

      conversation = await this.ConversationModel.create({
        directKey,
        type: 'direct',
        title,
        createdBy: senderId,
      });
      await this.ConversationParticipantModel.bulkCreate([
        {
          conversationId: conversation.id,
          userId: senderId,
        },
        {
          conversationId: conversation.id,
          userId: receiverId,
        },
      ]);
    }
    return this.MessageModel.create({
      conversationId: conversation.id,
      messageType,
      senderId,
      content,
    });
  }

  async getMessages(
    senderId: string,
    receiverId: string,
    limit: number = 30,
    before?: string,
  ) {
    const conversation = await this.findConversationBetweenUsers(
      senderId,
      receiverId,
    );
    if (!conversation) {
      return { message: '!conv', senderId, receiverId };
    }
    const conversationId = conversation.id;
    const where: any = {
      conversationId,
    };
    if (before) {
      where.createdAt = {
        [Op.lt]: before,
      };
    }

    const messages = await this.MessageModel.findAll({
      where: { messageType: 'text' },
      order: [['createdAt', 'DESC']],
      limit,
    });

    return messages;
  }

  async getConversations(userId: string, limit: number = 20, before?: string) {

      const where: any = {
      userId,
    };
    const data = await this.ConversationModel.findAll({
      where:
    });
  }
}
