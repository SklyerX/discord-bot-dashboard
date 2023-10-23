export enum DISCORD_API_ROUTES {
  RETRIEVE_TOKEN = "https://discord.com/api/v10/oauth2/token",
  USER_ENDPOINT = "https://discord.com/api/v10/users/@me",
  REVOKE_TOKEN = "https://discord.com/api/v10/oauth2/token/revoke",
  BASE = "https://discord.com/api/v10",
}

export type OAuth2ExchangeRequestParams = {
  client_id: string;
  client_secret: string;
  grant_type: string;
  code: string;
  redirect_uri: string;
};

export type OAuth2CredentialsResponse = {
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
};

export type OAuth2UserResponse = {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner: string | null;
  accent_color: number;
  global_name: string;
  avatar_decoration_data: string | null;
  banner_color: string;
  mfa_enabled: boolean;
  locale: string;
  premium_type: number;
  email: string;
  verified: boolean;
};

export type UserSchema = {
  discordId: string;
  username: string;
  discriminator: string;
  avatar: string;
  accessToken: string;
  refreshToken: string;
};

export type SessionSchema = {
  sessionId: string;
  expiresAt: Date;
  data: string;
};

export type PartialGuild = {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: string;
  features: Array<string>;
};

export type GuildChannel = {
  id: string;
  type: number;
  last_message_id: string;
  flags: number;
  guild_id: string;
  name: string;
  parent_id: string;
  rate_limit_per_user: number;
  topic: string | null;
  position: number;
  permission_overwrites?: [
    {
      id: string;
      type: number;
      allow: string;
      deny: string;
    }
  ];
  nsfw: boolean;
  icon_emoji?: {
    id: string | null;
    name: string;
  };
  theme_color: string | null;
};
