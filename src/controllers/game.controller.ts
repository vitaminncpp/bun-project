import type { Context } from "hono";
import * as gameService from "../services/game.service";
import SuccessResponse from "../models/SuccessResponse.model";
import { User as UserModel } from "../models/User.model";
import type { GameMatch } from "../models/game/GameMatch.model";
import { GameStatus } from "../lib/chess/games.enum";
import Constants from "../constants/constants";

export async function startMatch(c: Context) {
  const body = await c.req.json();
  const user: UserModel = c.get(Constants.AUTH_DATA);
  const match: GameMatch = await gameService.findMatch(
    user,
    body.connectionId,
    false
  );
  const statusCode = match.status === GameStatus.PENDING ? 202 : 200;
  const success =
    match.status === GameStatus.PENDING
      ? "Match request is created Succesfully"
      : "Match Found Succesfully";
  return c.json(new SuccessResponse(statusCode, success, match), statusCode);
}

export async function startMatchGuest(c: Context) {}

export async function cancelMatchRequest(c: Context) {
  const connectionId: string = c.req.param("connectionId");
  const user: UserModel = c.get(Constants.AUTH_DATA);
  const resData = gameService.cancelRequest(connectionId, user);
  return c.json(
    new SuccessResponse(200, "Request canceled sucessfully", resData),
    200
  );
}

export async function makeMove(c: Context) {}
