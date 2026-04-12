import { IsString } from 'class-validator';
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from './users.model';
import { Conversation } from './conversation.model';

interface MessageCreationAttributes {
  content: string;
  messageType: string;
  senderId: string;
  conversationId: string;
}

@Table({
  tableName: 'messages',
  timestamps: true,
})
export class Message extends Model<Message, MessageCreationAttributes> {
  @IsString()
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,

    allowNull: false,
    primaryKey: true,
    unique: true,
  })
  declare id: string;

  @IsString()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'Text',
  })
  declare messageType: string;

  @IsString()
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare content: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare senderId: string;

  @ForeignKey(() => Conversation)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare conversationId: string;
}
