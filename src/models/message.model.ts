import { IsOptional, IsString } from 'class-validator';
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
  messageType: string;
  senderId: string;
  conversationId: string;
  ciphertext?: string;
  iv?: string;
  authTage?: string;
  objectKey?: string;
  createdAt?: string;
}
export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'file';
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
    type: DataType.ENUM('text', 'image', 'video', 'audio', 'file'),
    allowNull: false,
    defaultValue: 'text',
  })
  declare messageType: MessageType;

  @IsOptional()
  @IsString()
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare ciphertext?: string;

  @IsOptional()
  @IsString()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare iv: string | null;

  @IsOptional()
  @IsString()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare authTag: string | null;

  @IsOptional()
  @IsString()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare objectKey: string | null;

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
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare createdAt: Date;
}
