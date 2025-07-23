import { GameStatus, GameResult } from "../../lib/chess/games.enum";

export class Game {
  id?: string;
  playerW!: string;
  playerB!: string;
  status!: GameStatus;

  result!: GameResult;
  ratingChangeW!: number;
  ratingChangeB!: number;
  startedAt!: Date;

  endedAt?: Date;
  timeControl!: number;

  constructor() {}

  static from(gameObj: {
    id?: string;
    playerW: string;
    playerB: string;
    status: GameStatus;

    result: GameResult;
    ratingChangeW: number;
    ratingChangeB: number;
    startedAt: Date;

    endedAt?: Date;
    timeControl: number;
  }): Game {
    const game = new Game();

    game.id = gameObj.id;
    game.playerW = gameObj.playerW;
    game.playerB = gameObj.playerB;
    game.status = gameObj.status;

    game.result = gameObj.result;
    game.ratingChangeW = gameObj.ratingChangeW;
    game.ratingChangeB = gameObj.ratingChangeB;
    game.startedAt = gameObj.startedAt;

    game.endedAt = gameObj.endedAt;
    game.timeControl = gameObj.timeControl;

    return game;
  }
  getCopy(): Game {
    return Game.from({
      id: this.id,
      playerW: this.playerW,
      playerB: this.playerB,
      status: this.status,

      result: this.result,
      ratingChangeW: this.ratingChangeW,
      ratingChangeB: this.ratingChangeB,
      startedAt: this.startedAt,

      endedAt: this.endedAt,
      timeControl: this.timeControl,
    });
  }
}
