import {
  Table,
  Column,
  Model,
  PrimaryKey,
  BelongsToMany,
  DataType,
  HasMany,
  Default,
  HasOne,
} from "sequelize-typescript";

import { Role } from "./Role.entity";
import { UserRole } from "./UserRole.entity";
import { Game } from "./Game.entity";
import { Profile } from "./Profile.entity";

@Table({ modelName: "users" })
export class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  id!: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  username!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  isDeleted!: boolean;

  @BelongsToMany(() => Role, () => UserRole)
  roles!: Role[];

  @HasMany(() => Game, "playerW")
  gamesW!: Game[];

  @HasMany(() => Game, "playerB")
  gamesB!: Game[];

  @HasOne(() => Profile, "userId")
  profile!: Profile;
}
