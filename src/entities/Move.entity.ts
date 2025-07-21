import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
} from "sequelize-typescript";
import { Game } from "./Game.entity";
import { GamePiece, Player, FILE, MoveType } from "../lib/chess/games.enum";

@Table({ modelName: "moves", timestamps: true })
export class Move extends Model<Move> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  id!: string;

  @ForeignKey(() => Game)
  @Column({ type: DataType.STRING, allowNull: false })
  gameId!: string;

  @BelongsTo(() => Game, { foreignKey: "gameId" })
  game!: Game;

  @Column({ type: DataType.INTEGER, allowNull: false })
  moveNumber!: number;

  @Column({ type: DataType.ENUM(...Object.values(Player)), allowNull: false })
  player!: Player;

  @Column({ type: DataType.ENUM(...Object.values(FILE)), allowNull: false })
  fromFile!: FILE;

  @Column({ type: DataType.TINYINT, allowNull: false })
  fromRank!: number;

  @Column({ type: DataType.ENUM(...Object.values(FILE)), allowNull: false })
  toFile!: FILE;

  @Column({ type: DataType.TINYINT, allowNull: false })
  toRank!: number;

  @Column({ type: DataType.ENUM(...Object.keys(GamePiece)), allowNull: false })
  piece?: GamePiece;

  @Column({ type: DataType.ENUM(...Object.keys(MoveType)), allowNull: false })
  moveType?: MoveType;

  @Column({ type: DataType.ENUM(...Object.keys(GamePiece)), allowNull: true })
  capturedPiece?: GamePiece;

  @Column({ type: DataType.ENUM(...Object.keys(GamePiece)), allowNull: true })
  promotion?: GamePiece;

  @Column({ type: DataType.STRING, allowNull: false })
  notation?: string;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt!: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt!: Date;
}
