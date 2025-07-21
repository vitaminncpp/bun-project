import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
  Unique,
} from "sequelize-typescript";
import { User } from "./User.entity";

@Table({ modelName: "profiles" })
export class Profile extends Model<Profile> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  id!: string;

  @ForeignKey(() => User)
  @Unique
  @Column({ type: DataType.STRING, allowNull: false })
  userId!: string;

  @BelongsTo(() => User, { foreignKey: "userId" })
  user!: User;

  @Column({ type: DataType.INTEGER, defaultValue: 400, allowNull: false })
  rating!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0, allowNull: false })
  gamesPlayed!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0, allowNull: false })
  wins!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0, allowNull: false })
  losses!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0, allowNull: false })
  draws!: number;

  @Column({ type: DataType.STRING, allowNull: true })
  bio?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  avatarUrl?: string;
}
