import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
  HasMany,
} from "sequelize-typescript";
import { User as UserEntity } from "./User.entity";
import { GameResult, GameSatus } from "../lib/chess/games.enum";
import { Move } from "./Move.entity";

@Table({ modelName: "games", timestamps: true })
export class Game extends Model<Game> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  id!: string;

  @ForeignKey(() => UserEntity)
  @Column({ type: DataType.STRING, allowNull: false })
  playerW!: string;

  @ForeignKey(() => UserEntity)
  @Column({ type: DataType.STRING, allowNull: false })
  playerB!: string;

  @BelongsTo(() => UserEntity, { as: "whitePlayer", foreignKey: "playerW" })
  whitePlayer!: UserEntity;

  @BelongsTo(() => UserEntity, { as: "blackPlayer", foreignKey: "playerB" })
  blackPlayer!: UserEntity;

  @Column({
    type: DataType.ENUM(...Object.values(GameSatus)),
    allowNull: false,
    defaultValue: GameSatus.PENDING,
  })
  status!: GameSatus;

  @HasMany(() => Move, { foreignKey: "gameId" })
  move!: Move[];

  @Column({
    type: DataType.ENUM(...Object.values(GameResult)),
    allowNull: false,
    defaultValue: GameResult.PENDING,
  })
  result!: GameResult;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  ratingChangeW!: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  ratingChangeB!: number;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  startedAt!: Date;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  endedAt!: Date;

  @Column({ type: DataType.INTEGER, allowNull: false })
  timeControl!: number;
}
