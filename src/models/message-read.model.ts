import {
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Message } from './message.model';
import { User } from './users.model';

interface MessageReadsCreationAttributes {
  id: string;
  messageId: string;
  userId: string;
}

@Table({
  tableName: 'message_reads',
  timestamps: true,
})
export class MessageRead extends Model<
  MessageRead | MessageReadsCreationAttributes
> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,

    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => Message)
  @Column({ type: DataType.UUID, allowNull: false })
  declare messageId: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare userId: string;
}
