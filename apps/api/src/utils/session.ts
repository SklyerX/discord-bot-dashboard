import cookieParser from "cookie-parser";
import { Request, Response } from "express";
import session from "../database/models/session";
import { UserSchema } from "./types";

export async function serializeSession(req: Request, user: UserSchema) {
  req.session.user = user;
  req.user = user;

  return req.user;
}

export async function deserializeSession(
  req: Request,
  res: Response,
  next: Function
) {
  const { DISCORD_OAUTH2_SESSION_ID } = req.cookies;
  if (!DISCORD_OAUTH2_SESSION_ID) return next();

  const sessionId = cookieParser
    .signedCookie(DISCORD_OAUTH2_SESSION_ID, process.env.COOKIE_SECRET!)
    .toString();
  const sessionDB = await session.findOne({
    _id: sessionId,
  });

  console.log(sessionId);

  if (!sessionDB) {
    console.log("No Session");
    return next();
  }
  const currentTime = new Date();
  if (sessionDB.expiresAt! < currentTime) {
    console.log("Session Expired");
    await session.deleteOne({ sessionId: sessionDB._id });
    console.log("Session Deleted");
  } else {
    console.log("Session Not Expired");
    const data = JSON.parse(sessionDB.session?.toString()!);
    req.user = data;
  }
  next();
}
