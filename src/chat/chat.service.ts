import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { GetConversationsDto } from 'src/Dtos/conversation.dto';
import { ConversationParticipant } from 'src/models/conversation-participant.model';
import { Conversation } from 'src/models/conversation.model';
import { Message } from 'src/models/message.model';
import { User } from 'src/models/users.model';
import { buildLastMessagePreview } from 'src/utils/message-preview.util';

export interface ConversationParticipantCreation {
  conversationId: string;
  userId: string;
}

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
    messageType: string,
    ciphertext?: string,
    iv?: string,
    objectKey?: string,
    authTage?: string,
  ) {
    let conversation: Conversation | null;
    // 1. Check for existing conversation
    conversation = await this.findConversationBetweenUsers(
      senderId,
      receiverId,
    );

    // 2. If it doesn't exist, create it and ASSIGN it to our variable
    if (!conversation?.id) {
      const directKey = [senderId, receiverId].sort().join(':');
      const receiver = await this.UserModel.findByPk(receiverId, {
        attributes: ['id', 'name'],
      });

      const title = receiver?.name || 'User';

      conversation = await this.ConversationModel.create({
        directKey,
        type: 'direct',
        title,
        createdBy: senderId,
      });

      await this.ConversationParticipantModel.bulkCreate([
        { conversationId: conversation.id, userId: senderId },
        { conversationId: conversation.id, userId: receiverId },
      ]);
    }

    // 3. Now 'conversation' is guaranteed to exist
    return this.sequelize.transaction(async (t) => {
      const message = await this.MessageModel.create(
        {
          conversationId: conversation.id, // Now this won't be null
          messageType,
          senderId,
          ciphertext,
          iv,
          authTage,
          objectKey,
        },
        { transaction: t },
      );

      await this.ConversationModel.update(
        {
          lastMessageAt: message.createdAt,
          lastMessagePreview: buildLastMessagePreview({
            messageType: message.messageType,
            content: message.ciphertext,
          }),
        },
        {
          where: { id: conversation.id },
          transaction: t,
        },
      );

      return message; // Good practice to return the created message
    });
  }

  async getMessages(
    conversationId: string,
    limit: number = 30,
    before?: string,
  ) {
    // const conversation = await this.findConversationBetweenUsers(
    //   senderId,
    //   receiverId,
    // );
    // if (!conversation) {
    //   return { message: '!conv', senderId, receiverId };
    // }
    // const conversationId = conversation.id;
    const where: WhereOptions<Message> = {
      conversationId,
    };

    if (before) {
      where.createdAt = {
        [Op.lt]: before,
      };
    }

    const messages = await this.MessageModel.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
    });

    return messages;
  }

  async getConversations(userId: string, ConversationDto: GetConversationsDto) {
    const { limit, cursor } = ConversationDto;
    const where: WhereOptions<Conversation> = {};

    if (cursor) {
      where.lastMessageAt = {
        [Op.lt]: cursor,
      };
    }

    return await Conversation.findAll({
      include: [
        {
          model: ConversationParticipant,
          as: 'participants',
          where: { userId },
          attributes: [], // We don't need the current user's data back
        },
        {
          model: ConversationParticipant,
          as: 'otherParticipants', // Use an alias for clarity
          where: {
            userId: { [Op.ne]: userId }, // Find the person NOT me
          },
          include: [
            {
              model: User,
              attributes: ['id', 'name', 'avatar'],
            },
          ],
        },
      ],
    });
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
