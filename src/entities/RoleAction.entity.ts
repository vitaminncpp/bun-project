import {
  DataType,
  Default,
  PrimaryKey,
  Model,
  Column,
  ForeignKey,
  BelongsTo,
  Table,
} from "sequelize-typescript";
import { Role } from "./Role.entity";
import { Action } from "../policies/actions.policy";

@Table({ modelName: "role_actions", timestamps: false })
export class RoleAction extends Model<RoleAction> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  id!: string;

  @ForeignKey(() => Role)
  @Column({ type: DataType.STRING, allowNull: false })
  roleId!: string;

  @Column({ type: DataType.ENUM(...Object.values(Action)), allowNull: false })
  action!: string;
  @Column({ type: DataType.STRING, allowNull: true })
  description?: string;

  @BelongsTo(() => Role, { foreignKey: "roleId" })
  role!: Role;
}
