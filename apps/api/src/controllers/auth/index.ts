import { AxiosError } from "axios";
import { Request, Response } from "express";
import {
  createUser,
  exchangeAccessCodeForCredentials,
  getDiscordUserDetails,
  revokeAccessToken,
} from "../../services/auth";
import { encrypt } from "../../utils/crypto";
import { buildOAuth2CredentialsRequestForm } from "../../utils/helpers";
import { error, info } from "../../utils/logger";
import { serializeSession } from "../../utils/session";
import { UserSchema } from "../../utils/types";

export async function authDiscordRedirectController(
  req: Request,
  res: Response
) {
  const { code } = req.query;

  if (code) {
    try {
      const payload = buildOAuth2CredentialsRequestForm(code.toString());
      const { data: credentials } =
        await exchangeAccessCodeForCredentials(payload);

      const { access_token, refresh_token } = credentials;
      const { data: user } = await getDiscordUserDetails(access_token);

      const encryptedAccessToken = encrypt(access_token);
      const encryptedRefreshToken = encrypt(refresh_token);

      info(access_token);
      info(refresh_token);

      const newUser = await createUser({
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        avatar: user.avatar,
        discordId: user.id,
        discriminator: user.discriminator,
        username: user.username,
      });

      await serializeSession(req, newUser as unknown as UserSchema);

      res.redirect(`${process.env.ACTUAL_SITE!}/dashboard`);
    } catch (err) {
      if (err instanceof AxiosError) {
        error(err.response?.data);
      }
    }
  }
}

export async function getAuthenticatedUser(req: Request, res: Response) {
  return req.session.user
    ? res.send(req.session.user)
    : res.status(401).send("Unauthorized");
}

export async function signUserOut(req: Request, res: Response) {
  try {
    await revokeAccessToken(req.session.user.accessToken);

    req.session.destroy((err) => {
      if (err) {
        error("Error destroying session:", err);
      } else {
        info("Session destroyed");
      }
    });

    res.redirect(process.env.ACTUAL_SITE!);
  } catch (err) {
    error(err);
    res.status(400).send(err);
  }
}
