import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Conversation } from './conversation.model';
import { User } from './users.model';

export enum ParticipantRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
}
interface ConversationParticipantCreationAttributes {
  role?: ParticipantRole;
  userId: string;
  conversationId: string;
}
@Table({ tableName: 'conversation_participants' })
export class ConversationParticipant extends Model<
  ConversationParticipant | ConversationParticipantCreationAttributes
> {
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: ParticipantRole.MEMBER,
  })
  declare role: ParticipantRole;

  @ForeignKey(() => User)
  @Column({ type: DataType.STRING, allowNull: false })
  declare userId: string;

  @ForeignKey(() => Conversation)
  @Column({ type: DataType.STRING, allowNull: false })
  declare conversationId: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare joinedAt: Date;
}
