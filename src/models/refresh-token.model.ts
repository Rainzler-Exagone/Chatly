import {
  Column,
  DataType,
  ForeignKey,
  Model,
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
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare token: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
  })
  declare userId: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare expiryDate: Date;
}
