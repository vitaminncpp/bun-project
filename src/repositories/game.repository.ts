import { Game as GameModel } from "../models/game/Game.model";
import { db } from "../database/database.connection.ts";
import { games as gameTable } from "../entities/Game.entity.ts";
import { Exception } from "../exceptions/app.exception.ts";
import ErrorCode from "../enums/errorcodes.enum.ts";

export async function insertOne(game: GameModel): Promise<GameModel> {
  try {
    const inserted = await db
      .insert(gameTable)
      .values(game as any)
      .returning();
    if (!inserted) {
      throw new Exception(
        ErrorCode.RECORD_INSERTION_FAILED,
        "Error Inserting User",
        game
      );
    }
    game.id = inserted[0]!.id;
    return game;
  } catch (err: Error | any) {
    if (err instanceof Exception) throw err;
    throw new Exception(
      ErrorCode.RECORD_INSERTION_FAILED,
      err?.message || "Error Inserting User",
      err
    );
  }
}