"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unbanUser = exports.getBans = exports.deleteGuildInfo = exports.resetInfo = exports.setupCounter = exports.moveChannel = exports.updateGuildSettings = exports.getGuildChannelsController = exports.getGuildSettings = exports.getGuildsController = void 0;
const guilds_1 = require("../../services/guilds");
const logger_1 = require("../../utils/logger");
const settings_1 = require("../../utils/validators/settings");
const channel_1 = require("../../utils/validators/channel");
const crypto_1 = require("../../utils/crypto");
function getGuildsController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const accessToken = req.session.user.accessToken;
            const decryptedAccessToken = (0, crypto_1.decrypt)(accessToken);
            const mutualGuilds = yield (0, guilds_1.retrieveMutualGuilds)(decryptedAccessToken);
            return res.status(200).send(mutualGuilds);
        }
        catch (err) {
            (0, logger_1.error)(err);
            return res.status(400).send(err);
        }
    });
}
exports.getGuildsController = getGuildsController;
function getGuildSettings(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const guildSettings = yield (0, guilds_1.retrieveGuildSettings)(req.params.id);
            return res.status(200).send(guildSettings);
        }
        catch (err) {
            (0, logger_1.error)(err);
            return res.status(400).send(err);
        }
    });
}
exports.getGuildSettings = getGuildSettings;
function getGuildChannelsController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const channels = yield (0, guilds_1.getGuildChannels)(req.params.id);
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
        }
        catch (err) {
            (0, logger_1.error)(err);
            return res.status(400).send(err);
        }
    });
}
exports.getGuildChannelsController = getGuildChannelsController;
function updateGuildSettings(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            const { banOnError, dontAllowSameUser, resetOnError } = settings_1.SettingsValidator.parse(body);
            if (typeof banOnError !== "boolean" &&
                typeof dontAllowSameUser !== "boolean" &&
                typeof resetOnError !== "boolean")
                return res
                    .status(400)
                    .send({ message: "At least one field must be present" });
            yield (0, guilds_1.updateSettings)(req.params.id, {
                banOnError,
                dontAllowSameUser,
                resetOnError,
            });
            return res.status(200).send({ success: 1, message: "👍 🚀" });
        }
        catch (err) {
            (0, logger_1.error)(err);
            return res.status(400).send(err);
        }
    });
}
exports.updateGuildSettings = updateGuildSettings;
function moveChannel(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            const { channelId } = channel_1.ChannelValidator.parse(body);
            const decryptedChannelId = (0, crypto_1.decrypt)(channelId);
            const guildSettings = yield (0, guilds_1.updateChannel)(req.params.id, decryptedChannelId);
            return res.status(200).send(guildSettings);
        }
        catch (err) {
            (0, logger_1.error)(err);
            return res.status(400).send(err);
        }
    });
}
exports.moveChannel = moveChannel;
function setupCounter(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            const { channelId } = channel_1.ChannelValidator.parse(body);
            const decryptedChannelId = (0, crypto_1.decrypt)(channelId);
            const guildSettings = yield (0, guilds_1.createCounter)(req.params.id, decryptedChannelId);
            return res.status(200).send(guildSettings);
        }
        catch (err) {
            (0, logger_1.error)(err);
            return res.status(400).send(err);
        }
    });
}
exports.setupCounter = setupCounter;
function resetInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, guilds_1.resetChannelData)(req.params.id);
            return res.status(200).send({ success: 1, message: "👍 🚀" });
        }
        catch (err) {
            (0, logger_1.error)(err);
            return res.status(400).send(err);
        }
    });
}
exports.resetInfo = resetInfo;
function deleteGuildInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, guilds_1.deleteGuildData)(req.params.id);
            return res.status(200).send({ success: 1, message: "👍 🚀" });
        }
        catch (err) {
            (0, logger_1.error)(err);
            return res.status(400).send(err);
        }
    });
}
exports.deleteGuildInfo = deleteGuildInfo;
function getBans(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const bans = yield (0, guilds_1.getChannelBans)(req.params.id);
            return res.status(200).send(bans);
        }
        catch (err) {
            (0, logger_1.error)(err);
            return res.status(400).send(err);
        }
    });
}
exports.getBans = getBans;
function unbanUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, guilds_1.unbanUserById)(req.params.id, req.params.discordId);
            return res.status(200).send({ success: 1, message: "👍 🚀" });
        }
        catch (err) {
            (0, logger_1.error)(err);
            return res.status(400).send(err);
        }
    });
}
exports.unbanUser = unbanUser;
