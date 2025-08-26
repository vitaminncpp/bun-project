import { Game as GameModel } from "../models/game/Game.model";
import { db } from "../database/database.connection.ts";
import { games as gameTable } from "../entities/Game.entity.ts";
import { Exception } from "../exceptions/app.exception.ts";
import ErrorCode from "../enums/errorcodes.enum.ts";
import { eq } from "drizzle-orm";

export async function insertOne(game: GameModel): Promise<GameModel> {
  try {
    const inserted = await db
      .insert(gameTable)
      .values(game as any)
      .returning();
    if (!inserted || inserted.length === 0) {
      throw new Exception(
        ErrorCode.RECORD_INSERTION_FAILED,
        "Error Inserting User",
        game
      );
    }
    return GameModel.from(inserted[0]);
  } catch (err: Error | any) {
    if (err instanceof Exception) throw err;
    throw new Exception(
      ErrorCode.RECORD_INSERTION_FAILED,
      err?.message || "Error Inserting User",
      err
    );
  }
}

export async function updateOne(
  gameId: string,
  game: Partial<GameModel>
): Promise<GameModel> {
  try {
    const updated = await db
      .update(gameTable)
      .set(game)
      .where(eq(gameTable.id, gameId))
      .returning();

    if (!updated || updated.length === 0) {
      throw new Exception(ErrorCode.GAME_UPDATE_FAILED, "Error Updating Game", {
        gameId,
        game,
      });
    }
    return updated[0] as GameModel;
  } catch (err: Error | any) {
    if (err instanceof Exception) throw err;
    throw new Exception(
      ErrorCode.GAME_UPDATE_FAILED,
      err?.message || "Error Updating Game",
      err
    );
  }
}

export async function findById(gameId: string): Promise<GameModel> {
  try {
    const [game] = await db
      .select()
      .from(gameTable)
      .where(eq(gameTable.id, gameId));
    if (!game) {
      throw new Exception(
        ErrorCode.INVALID_GAME_ID,
        "Game does not Exists",
        gameId
      );
    }
    return GameModel.from(game as any);
  } catch (err: Exception | Error | any) {
    if (err instanceof Exception) throw err;
    throw new Exception(
      ErrorCode.ERROR_FETCHING_DATA,
      err?.message || "Error Fetching Game Data",
      err || gameId
    );
  }
}
