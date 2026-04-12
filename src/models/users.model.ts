import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
} from 'sequelize-typescript';

interface UserCreationAttributes {
  // id: string;
  name: string;
  email: string;
  password: string;
}

@Table({
  tableName: 'users',
})
export class User extends Model<User, UserCreationAttributes> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
