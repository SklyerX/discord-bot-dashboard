import { Request, Response } from "express";
import {
  retrieveMutualGuilds,
  retrieveGuildSettings,
  updateSettings,
  resetChannelData,
  updateChannel,
  getGuildChannels,
  createCounter,
  getChannelBans,
  unbanUserById,
  deleteGuildData,
} from "../../services/guilds";
import { error } from "../../utils/logger";
import { SettingsValidator } from "../../utils/validators/settings";
import { ChannelValidator } from "../../utils/validators/channel";
import { decrypt } from "../../utils/crypto";

export async function getGuildsController(req: Request, res: Response) {
  try {
    const accessToken = req.session.user.accessToken;

    const decryptedAccessToken = decrypt(accessToken);

    const mutualGuilds = await retrieveMutualGuilds(decryptedAccessToken);

    return res.status(200).send(mutualGuilds);
  } catch (err) {
    error(err);
    return res.status(400).send(err);
  }
}

export async function getGuildSettings(req: Request, res: Response) {
  try {
    const guildSettings = await retrieveGuildSettings(req.params.id);

    return res.status(200).send(guildSettings);
  } catch (err) {
    error(err);
    return res.status(400).send(err);
  }
}

export async function getGuildChannelsController(req: Request, res: Response) {
  try {
    const channels = await getGuildChannels(req.params.id);

    const formattedChannels = channels
      .filter((channel) => channel.type === 0)
      .map((channel) => {
        return {
          id: channel.id,
          nsfw: channel.nsfw,
          name: channel.name,
        };
      });

    return res.status(200).send(formattedChannels);
  } catch (err) {
    error(err);
    return res.status(400).send(err);
  }
}

export async function updateGuildSettings(req: Request, res: Response) {
  try {
    const body = req.body;
    const { banOnError, dontAllowSameUser, resetOnError } =
      SettingsValidator.parse(body);

    if (
      typeof banOnError !== "boolean" &&
      typeof dontAllowSameUser !== "boolean" &&
      typeof resetOnError !== "boolean"
    )
      return res
        .status(400)
        .send({ message: "At least one field must be present" });

    await updateSettings(req.params.id, {
      banOnError,
      dontAllowSameUser,
      resetOnError,
    });

    return res.status(200).send({ success: 1, message: "👍 🚀" });
  } catch (err) {
    error(err);
    return res.status(400).send(err);
  }
}

export async function moveChannel(req: Request, res: Response) {
  try {
    const body = req.body;
    const { channelId } = ChannelValidator.parse(body);

    const decryptedChannelId = decrypt(channelId);

    const guildSettings = await updateChannel(
      req.params.id,
      decryptedChannelId
    );

    return res.status(200).send(guildSettings);
  } catch (err) {
    error(err);
    return res.status(400).send(err);
  }
}

export async function setupCounter(req: Request, res: Response) {
  try {
    const body = req.body;
    const { channelId } = ChannelValidator.parse(body);

    const decryptedChannelId = decrypt(channelId);

    const guildSettings = await createCounter(
      req.params.id,
      decryptedChannelId
    );

    return res.status(200).send(guildSettings);
  } catch (err) {
    error(err);
    return res.status(400).send(err);
  }
}

export async function resetInfo(req: Request, res: Response) {
  try {
    await resetChannelData(req.params.id);

    return res.status(200).send({ success: 1, message: "👍 🚀" });
  } catch (err) {
    error(err);
    return res.status(400).send(err);
  }
}

export async function deleteGuildInfo(req: Request, res: Response) {
  try {
    await deleteGuildData(req.params.id);

    return res.status(200).send({ success: 1, message: "👍 🚀" });
  } catch (err) {
    error(err);
    return res.status(400).send(err);
  }
}

export async function getBans(req: Request, res: Response) {
  try {
    const bans = await getChannelBans(req.params.id);

    return res.status(200).send(bans);
  } catch (err) {
    error(err);
    return res.status(400).send(err);
  }
}

export async function unbanUser(req: Request, res: Response) {
  try {
    await unbanUserById(req.params.id, req.params.discordId);

    return res.status(200).send({ success: 1, message: "👍 🚀" });
  } catch (err) {
    error(err);
    return res.status(400).send(err);
  }
}
