import { NextFunction, Request, Response } from "express";
import { retrieveUserGuilds } from "../services/guilds";
import { decrypt } from "./crypto";
import { sleep } from "./helpers";

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  return req.session.user ? next() : res.status(401).send("Unauthorized");
}

export async function ensureGuildPermission(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const decryptedAccessToken = decrypt(req.session.user.accessToken);
  await sleep(500);
  const { data: userGuilds } = await retrieveUserGuilds(decryptedAccessToken);

  const userGuild = userGuilds.find((guild) => guild.id === req.params.id);

  if (!userGuild)
    return res
      .status(404)
      .send({ message: "A guild with this ID was not found" });

  if ((+userGuild.permissions & 0x8) === 0x8) {
    next();
  } else {
    return res
      .status(403)
      .send({ message: "You don't have permission to view this guild!" });
  }
}
