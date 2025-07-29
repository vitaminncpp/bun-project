import type { PiecePosition } from "../types/chess.types";
import { MoveType } from "./games.enum";

export class Move {
    xSrc: PiecePosition = -1;
    ySrc: PiecePosition = -1;
    xDest: PiecePosition = -1;
    yDest: PiecePosition = -1;

    type: MoveType = MoveType.NOT_APPLICABLE;
    player: boolean = true;

    constructor(player: boolean) {
        this.player = player;
        this.init();
    }

    init() {
        this.xSrc = -1;
        this.ySrc = -1;
        this.xDest = -1;
        this.yDest = -1;
    }

    setSrc(x: PiecePosition, y: PiecePosition): boolean {
        this.xSrc = x;
        this.ySrc = y;
        return true;
    }

    setDest(x: PiecePosition, y: PiecePosition) {
        this.xDest = x;
        this.yDest = y;
        return true;
    }

    reset() {
        this.xSrc = -1;
        this.ySrc = -1;
        this.xDest = -1;
        this.yDest = -1;
        this.type = MoveType.NOT_APPLICABLE;
    }
}
