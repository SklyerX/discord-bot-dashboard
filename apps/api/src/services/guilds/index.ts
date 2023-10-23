import axios from "axios";
import counters from "../../database/models/counters";
import {
  DISCORD_API_ROUTES,
  GuildChannel,
  PartialGuild,
  UserSchema,
} from "../../utils/types";
import { SettingsCredentials } from "../../utils/validators/settings";
import { client } from "../..";
import { WebhookClient } from "discord.js";
import { error } from "../../utils/logger";

export const retrieveBotGuilds = () => {
  const guilds = client.guilds.cache;
  return guilds;
};

export const retrieveUserGuilds = (access_token: string) => {
  return axios.get<PartialGuild[]>(
    `${DISCORD_API_ROUTES.BASE}/users/@me/guilds?with_counts=true`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
};

export const retrieveMutualGuilds = async (access_token: string) => {
  const botGuilds = await retrieveBotGuilds();
  const { data: userGuilds } = await retrieveUserGuilds(access_token);

  const adminUserGuilds = userGuilds.filter(
    (guild) => (+guild.permissions & 0x8) === 0x8
  );
  const mutualGuilds = adminUserGuilds.filter((guild) =>
    botGuilds.some((botGuild) => guild.id === botGuild.id)
  );

  const combinedArray = adminUserGuilds.map((guild) => {
    const match = mutualGuilds.find((g) => g.id === guild.id);

    return {
      ...guild,
      bot: match ? true : false,
    };
  });

  return combinedArray.sort((a, b) => {
    if (a.bot === true && b.bot !== true) {
      return -1; // a comes first
    } else if (a.bot !== true && b.bot === true) {
      return 1; // b comes first
    } else {
      return 0; // no change in order
    }
  });
};

export const getGuildChannels = async (guildId: string) => {
  const { data } = await axios.get<GuildChannel[]>(
    `${DISCORD_API_ROUTES.BASE}/guilds/${guildId}/channels`,
    {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN!}`,
      },
    }
  );
  return data;
};

export const retrieveGuildSettings = async (guildId: string) => {
  const doc = await counters.findOne({ guildId }, "-id -__v -webhookURL");

  return doc;
};

export const updateSettings = async (
  guildId: string,
  payload: SettingsCredentials
) => {
  const doc = await counters.findOne({ guildId }, "-id -__v -webhookURL");

  if (!doc) throw new Error("A guild with this ID was not found!");

  await counters.findOneAndUpdate({ guildId }, payload, { new: true });

  return doc;
};

export const updateChannel = async (guildId: string, channelId: string) => {
  const doc = await counters.findOne({ guildId }, "-id -__v");

  if (!doc) throw new Error("A guild with this ID was not found!");

  const url = new URL(doc.webhookURL);

  const splitted_url = url.pathname.split("/webhooks/")[1].split("/");
  const webhook_id = splitted_url[0];
  const webhook_secret = splitted_url[1];

  await deleteWebhook(webhook_id, webhook_secret);

  const webhook = await createWebhook(guildId, channelId);

  await counters.findOneAndUpdate(
    { guildId },
    { $set: { channelId, webhookURL: webhook?.url } },
    { new: true }
  );

  return doc;
};

// TODO: change this to websocket connection wit discord.js :)
const createWebhook = async (guildId: string, channelId: string) => {
  const webhook = client.guilds.cache.get(guildId)?.channels.createWebhook({
    channel: channelId,
    name: "Counter++",
  });

  return webhook;
};

const deleteWebhook = async (webhookId: string, webhookSecret: string) => {
  try {
    client.deleteWebhook(webhookId, {
      token: webhookSecret,
    });
  } catch (err) {
    error(err);
  }
};

export const createCounter = async (guildId: string, channelId: string) => {
  const doc = await counters.findOne({ guildId }, "-id -__v -webhookURL");

  if (doc) throw new Error("You've already setup a counter for this guild!");

  // API CALL TO CREATE THE WEBHOOK
  const webhook = await createWebhook(guildId, channelId);

  const data = new counters({
    banOnError: false,
    dontAllowSameUser: true,
    resetOnError: false,
    lastMessage: null,
    webhookURL: webhook?.url,
    channelId,
    bannedIds: [],
    guildId,
  }).save();

  return data;
};

export const resetChannelData = async (guildId: string) => {
  const doc = await counters.findOne({ guildId }, "-id -__v -webhookURL");

  if (!doc) throw new Error("A guild with this ID was not found!");

  await counters.findOneAndUpdate(
    { guildId },
    { $set: { lastMessage: null } },
    { new: true }
  );

  return doc;
};

export const deleteGuildData = async (guildId: string) => {
  const doc = await counters.findOne({ guildId }, "-id -__v -webhookURL");

  if (!doc) throw new Error("A guild with this ID was not found!");

  const url = new URL(doc.webhookURL);

  const splitted_url = url.pathname.split("/webhooks/")[1].split("/");
  const webhook_id = splitted_url[0];
  const webhook_secret = splitted_url[1];

  await deleteWebhook(webhook_id, webhook_secret);

  await counters.findOneAndDelete({ guildId });

  return doc;
};

export const getChannelBans = async (guildId: string) => {
  const doc = await counters.findOne({ guildId }, "-id -__v -webhookURL");

  if (!doc) throw new Error("A guild with this ID was not found!");

  return doc.bannedIds;
};

export const unbanUserById = async (guildId: string, discordId: string) => {
  const doc = await counters.findOne({ guildId }, "-id -__v -webhookURL");

  if (!doc) throw new Error("A guild with this ID was not found!");

  await counters.findOneAndUpdate(
    { guildId },
    { $pull: { bannedIds: { id: discordId } } },
    { new: true }
  );

  return doc;
};
