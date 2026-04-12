import { IsString } from 'class-validator';
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './users.model';

interface ConversationCreationAttributes {
  title?: string;
  type: string;
  createdBy: string;
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
}
