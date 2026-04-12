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

  async findConversationBetweenUsers(userA: string, userB: string) {
    const response = await this.ConversationParticipantModel.findOne({
      attributes: ['conversationId'],
      where: {
        userId: {
          [Op.in]: [userA, userB],
        },
      },
      group: ['conversationId'],
      having: this.sequelize.literal('COUNT(DISTINCT "userId") = 2'),
      raw: true,
    });
    if (!response) return null;

    return {
      id: response.conversationId,
    };
  }

  // async fCindConversationBetweenUsers(userA: string, userB: string) {
  //   const response = await this.ConversationParticipantModel.findOne({
  //     attributes: ['conversationId'],
  //     where: {
  //       userId: [userA, userB],
  //     },
  //     group: ['conversationId'],
  //     having: this.sequelize.literal('COUNT(DISTINCT "userId") = 2'),
  //     raw: true,
  //   });
  //   if (!response) {
  //     return null;
  //   }

  //   return response;
  // }

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

    if (!conversation) {
      const receiver = await this.UserModel.findByPk(receiverId, {
        attributes: ['id', 'name'],
      });
      const title =
        receiver?.name && receiver?.name
          ? `${receiver.name} ${receiver.name}`
          : receiver?.name || 'User';

      conversation = await this.ConversationModel.create({
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
}
