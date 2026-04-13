import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import {
  conversationDto,
  GetConversationsDto,
} from 'src/Dtos/conversation.dto';
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

    return this.sequelize.transaction(async (t) => {
      const message = await this.MessageModel.create(
        {
          conversationId: conversation.id,
          messageType,
          senderId,
          content,
        },
        { transaction: t },
      );

      await this.ConversationModel.update(
        {
          lastMessageAt: message.createdAt,
        },
        {
          where: {
            id: conversation.id,
          },
          transaction: t,
        },
      );
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

  async getConversations(userId: string, ConversationDto: GetConversationsDto) {
    const { limit, cursor } = ConversationDto;
    const where: any = {};

    if (cursor) {
      where.lastMessageAt = {
        [Op.lt]: cursor,
      };
    }
    const conversations = await this.ConversationModel.findAll({
      where,

      include: [
        {
          model: ConversationParticipant,
          where: { userId },
          attributes: [],
        },
      ],

      order: [['lastMessageAt', 'DESC']],

      limit,
    });

    return conversations;
  }

  async createConversation(
    userId: string,
    title: string,
    participantsIds: string[],
  ) {
    return this.sequelize.transaction(async (t) => {
      const uniqueParticipants = [...new Set([userId, ...participantsIds])];
      const conversation = await this.ConversationModel.create(
        {
          createdBy: userId,
          title,
          type: 'group',
        },
        { transaction: t },
      );
      const participants = uniqueParticipants.map((userId) => ({
        conversationId: conversation.id,
        userId,
      }));
      await this.ConversationParticipantModel.bulkCreate(participants);

      return conversation;
    });
  }
}
