import {
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from './users.model';

interface RefreshTokenCreationAttributes {
  token: string;
  userId: number;
  expiryDate: Date;
}
@Table({
  tableName: 'refresh_tokens',
})
export class RefreshToken extends Model<
  RefreshToken,
  RefreshTokenCreationAttributes
> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true,
  })
  declare id: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare token: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
  })
  declare userId: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare expiryDate: Date;
}
