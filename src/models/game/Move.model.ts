import { PLAYER, FILE, GamePiece, MoveType } from "../../lib/chess/games.enum";

export class Move {
  public id!: string;
  public gameId!: string;
  public moveNumber!: number;
  public player!: PLAYER;
  public fromFile!: FILE;
  public fromRank!: number;
  public toFile!: FILE;
  public toRank!: number;
  public piece!: GamePiece;
  public moveType!: MoveType;
  public capturedPiece?: GamePiece;
  public promotion?: GamePiece;
  public notation!: string;

  constructor() {}

  static from(moveObj: {
    id: string;
    gameId: string;
    moveNumber: number;
    player: PLAYER;
    fromFile: FILE;
    fromRank: number;
    toFile: FILE;
    toRank: number;
    piece: GamePiece;
    moveType: MoveType;
    capturedPiece?: GamePiece;
    promotion?: GamePiece;
    notation: string;
  }): Move {
    const move = new Move();
    move.id = moveObj.id;
    move.gameId = moveObj.gameId;
    move.moveNumber = moveObj.moveNumber;
    move.player = moveObj.player;
    move.fromFile = moveObj.fromFile;
    move.fromRank = moveObj.fromRank;
    move.toFile = moveObj.toFile;
    move.toRank = moveObj.toRank;
    move.piece = moveObj.piece;
    move.moveType = moveObj.moveType;
    move.capturedPiece = moveObj.capturedPiece;
    move.promotion = moveObj.promotion;
    move.notation = moveObj.notation;
    return move;
  }

  getCopy(): Move {
    return Move.from({
      id: this.id,
      gameId: this.gameId,
      moveNumber: this.moveNumber,
      player: this.player,
      fromFile: this.fromFile,
      fromRank: this.fromRank,
      toFile: this.toFile,
      toRank: this.toRank,
      piece: this.piece,
      moveType: this.moveType,
      capturedPiece: this.capturedPiece,
      promotion: this.promotion,
      notation: this.notation,
    });
  }
}
