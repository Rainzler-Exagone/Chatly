import { IsString } from 'class-validator';
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './users.model';
import { Optional } from '@nestjs/common';

interface ConversationCreationAttributes {
  title?: string;
  type: string;
  createdBy: string;
  lastMessageAt?: Date;
  lastMessagePreview?: Text;
}

@Table({ tableName: 'conversations' })
export class Conversation extends Model<
  Conversation | ConversationCreationAttributes
> {
  @IsString()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @IsString()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare title: string;

  @IsString()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare type: string;

  @IsString()
  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare createdBy: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  declare directKey: string;

  @Optional()
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare lastMessageAt: Date;

  @Optional()
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare lastMessagePreview: string;
}
