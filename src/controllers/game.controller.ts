import { Request, Response } from "express";
import * as gameService from "../services/game.service";
import SuccessResponse from "../models/SuccessResponse.model";
import { User as UserModel } from "../models/User.model";
import { GameMatch } from "../models/game/GameMatch.model";
import { GameSatus } from "../lib/chess/games.enum";

export async function startMatch(req: Request, res: Response) {
  console.log(req, res);
}

export async function startMatchGuest(req: Request, res: Response) {
  const user: UserModel = new UserModel();
  user.name = req.body.name || "Anonymous";
  user.metaInfo = { connectionId: req.body.connectionId };
  const resData: GameMatch = gameService.findMatch(user, true);
  const statusCode = resData.status === GameSatus.PENDING ? 202 : 200;
  const success =
    resData.status === GameSatus.PENDING
      ? "Match request is created Succesfully"
      : "Match Found Succesfully";
  res.status(statusCode).json(new SuccessResponse(statusCode, success, resData));
}

export async function cancelMatchRequest(req: Request, res: Response) {
  const connectionId: string = req.params.connectionId;
  const resData = gameService.cancelRequest(connectionId);
  res.status(200).json(new SuccessResponse(200, "Request canceled sucessfully", resData));
}
