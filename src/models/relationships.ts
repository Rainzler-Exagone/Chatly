import { ConversationParticipant } from './conversation-participant.model';
import { Conversation } from './conversation.model';
import { MessageRead } from './message-read.model';
import { Message } from './message.model';
import { RefreshToken } from './refresh-token.model';
import { User } from './users.model';

export function setupAssociations() {
  // users

  User.hasMany(ConversationParticipant, {
    foreignKey: 'userId',
    as: 'participants',
  });

  User.hasMany(Message, {
    foreignKey: 'senderId',
  });

  User.hasMany(Conversation, {
    foreignKey: 'createdBy',
  });

  User.hasMany(MessageRead, {
    foreignKey: 'userId',
  });

  User.hasOne(RefreshToken, {
    foreignKey: 'userId',
    as: 'refreshToken',
  });

  //Messages

  Message.belongsTo(User, {
    foreignKey: 'senderId',
  });

  Message.belongsTo(Conversation, {
    foreignKey: 'conversationId',
  });

  Message.hasMany(MessageRead, {
    foreignKey: 'messageId',
  });

  //Conversations

  Conversation.belongsTo(User, {
    foreignKey: 'createdBy',
    as: 'creator',
  });

  Conversation.hasMany(ConversationParticipant, {
    foreignKey: 'conversationId',
  });

  // Conversation Participants

  ConversationParticipant.belongsTo(Conversation, {
    foreignKey: 'conversationId',
  });

  ConversationParticipant.belongsTo(User, {
    foreignKey: 'userId',
  });

  //Message Reads

  MessageRead.belongsTo(User, {
    foreignKey: 'userId',
  });
  MessageRead.belongsTo(Message, {
    foreignKey: 'messageId',
  });

  RefreshToken.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });
}
