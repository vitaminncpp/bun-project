import {
  Table,
  Column,
  Model,
  ForeignKey,
  PrimaryKey,
  DataType,
  BelongsTo,
  Default,
} from "sequelize-typescript";
import { User } from "./User.entity";
import { Role } from "./Role.entity";

@Table({ modelName: "user_roles", timestamps: false })
export class UserRole extends Model<UserRole> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  id!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.STRING, allowNull: false })
  userId!: string;

  @ForeignKey(() => Role)
  @Column({ type: DataType.STRING, allowNull: false })
  roleId!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  description!: string;

  @BelongsTo(() => User, { as: "user", foreignKey: "userId" })
  user!: User;

  @BelongsTo(() => Role, { as: "role", foreignKey: "roleId" })
  role!: Role;
}
