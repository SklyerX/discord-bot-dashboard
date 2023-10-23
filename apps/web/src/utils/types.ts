export type PartialGuild = {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: string;
  features: Array<string>;
  approximate_member_count: number;
  approximate_presence_count: number;
  bot: boolean;
};

export type Settings = {
  guildId: string;
  channelId: string;
  lastMessage?: {
    authorId: string;
    content: number;
  };
  resetOnError: boolean;
  dontAllowSameUser: boolean;
  banOnError: boolean;
};

export type PartialChannel = {
  id: string;
  name: string;
  nsfw: boolean;
};

export type User = {
  discordId: string;
  avatar: string;
  username: string;
  accessToken: string;
  refreshToken: string;
};

export type BannedUser = {
  id: string;
  avatar: string;
  name: string;
};
