import {
  Table,
  Column,
  Model,
  PrimaryKey,
  BelongsToMany,
  DataType,
  Default,
  HasMany,
} from "sequelize-typescript";
import { User } from "./User.entity";
import { UserRole } from "./UserRole.entity";
import { RoleAction } from "./RoleAction.entity";

@Table({ modelName: "roles" })
export class Role extends Model<Role> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  id!: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  rolename!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  description?: string;

  @Column({
    type: DataType.STRING,
    defaultValue: false,
    allowNull: false,
  })
  isDeleted!: boolean;

  @BelongsToMany(() => User, () => UserRole)
  users!: Role[];

  @HasMany(() => RoleAction, "roleId")
  actions!: RoleAction;
}
