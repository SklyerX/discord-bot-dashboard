import { config } from "dotenv";
import { OAuth2ExchangeRequestParams, OAuth2UserResponse } from "./types";
config();

const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URL } =
  process.env;

export const buildOAuth2CredentialsRequestForm = (code: string) => ({
  client_id: DISCORD_CLIENT_ID || "",
  client_secret: DISCORD_CLIENT_SECRET || "",
  grant_type: "authorization_code",
  redirect_uri: DISCORD_REDIRECT_URL || "",
  code,
});

export const buildOAuth2RequestPayload = (data: OAuth2ExchangeRequestParams) =>
  new URLSearchParams(data);

export const buildUser = (
  user: OAuth2UserResponse,
  credentials: {
    accessToken: string;
    refreshToken: string;
  }
) => ({
  discordId: user.id,
  username: user.username,
  discriminator: user.discriminator,
  avatar: user.avatar,
  accessToken: credentials.accessToken,
  refreshToken: credentials.refreshToken,
});

export const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
