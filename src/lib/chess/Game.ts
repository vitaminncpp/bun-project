import { Chessboard } from "./chessboard";
import { Player } from "./players";
import { State } from "./state";
import { Move } from "./move";
import Config from "../config/chess.config";
import { MoveType } from "./games.enum";

export class Game {
  board: Chessboard;
  playerW: Player;
  playerB: Player;
  state: State = new State();

  constructor() {
    this.board = new Chessboard();
    this.playerW = new Player(this.board, true);
    this.playerB = new Player(this.board, false);
    this.playerW.setOpponent(this.playerB);
    this.playerB.setOpponent(this.playerW);
    this.update();
  }

  getBoard() {
    return this.board;
  }

  move(move: Move): Move {
    if (this.state.turn === move.player) {
      const ret: Move = this.board.move(move);
      this.update();
      this.state.turn = !this.state.turn;
      return ret;
    }
    move.type = MoveType.WRONG_PLAYER;
    return move;
  }

  update(): boolean {
    this.board.update();
    return true;
  }

  getMoveMapFor(x: number, y: number, color: boolean): boolean[][] {
    if (this.state.turn === color) {
      return this.board.board[x][y].piece!.getMoveMap();
    }
    return Config.empty;
  }
}
