import axios from "axios";
import url from "url";
import user from "../../database/models/user";
import { axiosConfig } from "../../utils/constants";
import { buildOAuth2RequestPayload } from "../../utils/helpers";
import {
  DISCORD_API_ROUTES,
  OAuth2CredentialsResponse,
  OAuth2ExchangeRequestParams,
  OAuth2UserResponse,
  UserSchema,
} from "../../utils/types";
import { decrypt } from "../../utils/crypto";

export function exchangeAccessCodeForCredentials(
  data: OAuth2ExchangeRequestParams
) {
  const payload = buildOAuth2RequestPayload(data);

  return axios.post<OAuth2CredentialsResponse>(
    DISCORD_API_ROUTES.RETRIEVE_TOKEN,
    payload,
    axiosConfig
  );
}

export function getDiscordUserDetails(access_token: string) {
  return axios.get<OAuth2UserResponse>(DISCORD_API_ROUTES.USER_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
}

export async function createUser(data: UserSchema) {
  const dbUser = await user.findOne({ discordId: data.discordId });

  if (dbUser) {
    const updatedUser = await updateUser(data);
    return updatedUser;
  }

  const newUser = new user(data).save();

  return newUser;
}

export async function updateUser(params: UserSchema) {
  return user.findOneAndUpdate(
    { discordId: params.discordId },
    { $set: { ...params } },
    { new: true }
  );
}

export async function revokeAccessToken(access_token: string) {
  const decryptedToken = decrypt(access_token).toString();
  const form_data = new url.URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID!,
    client_secret: process.env.DISCORD_CLIENT_SECRET!,
    token: decryptedToken,
  });

  return axios.post(
    DISCORD_API_ROUTES.REVOKE_TOKEN,
    form_data.toString(),
    axiosConfig
  );
}
