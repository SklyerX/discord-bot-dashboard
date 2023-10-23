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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unbanUserById = exports.getChannelBans = exports.deleteGuildData = exports.resetChannelData = exports.createCounter = exports.updateChannel = exports.updateSettings = exports.retrieveGuildSettings = exports.getGuildChannels = exports.retrieveMutualGuilds = exports.retrieveUserGuilds = exports.retrieveBotGuilds = void 0;
const axios_1 = __importDefault(require("axios"));
const counters_1 = __importDefault(require("../../database/models/counters"));
const types_1 = require("../../utils/types");
const __1 = require("../..");
const logger_1 = require("../../utils/logger");
const retrieveBotGuilds = () => {
    const guilds = __1.client.guilds.cache;
    return guilds;
};
exports.retrieveBotGuilds = retrieveBotGuilds;
const retrieveUserGuilds = (access_token) => {
    return axios_1.default.get(`${types_1.DISCORD_API_ROUTES.BASE}/users/@me/guilds?with_counts=true`, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
};
exports.retrieveUserGuilds = retrieveUserGuilds;
const retrieveMutualGuilds = (access_token) => __awaiter(void 0, void 0, void 0, function* () {
    const botGuilds = yield (0, exports.retrieveBotGuilds)();
    const { data: userGuilds } = yield (0, exports.retrieveUserGuilds)(access_token);
    const adminUserGuilds = userGuilds.filter((guild) => (+guild.permissions & 0x8) === 0x8);
    const mutualGuilds = adminUserGuilds.filter((guild) => botGuilds.some((botGuild) => guild.id === botGuild.id));
    const combinedArray = adminUserGuilds.map((guild) => {
        const match = mutualGuilds.find((g) => g.id === guild.id);
        return Object.assign(Object.assign({}, guild), { bot: match ? true : false });
    });
    return combinedArray.sort((a, b) => {
        if (a.bot === true && b.bot !== true) {
            return -1;
        }
        else if (a.bot !== true && b.bot === true) {
            return 1;
        }
        else {
            return 0;
        }
    });
});
exports.retrieveMutualGuilds = retrieveMutualGuilds;
const getGuildChannels = (guildId) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield axios_1.default.get(`${types_1.DISCORD_API_ROUTES.BASE}/guilds/${guildId}/channels`, {
        headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
    });
    return data;
});
exports.getGuildChannels = getGuildChannels;
const retrieveGuildSettings = (guildId) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield counters_1.default.findOne({ guildId }, "-id -__v -webhookURL");
    return doc;
});
exports.retrieveGuildSettings = retrieveGuildSettings;
const updateSettings = (guildId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield counters_1.default.findOne({ guildId }, "-id -__v -webhookURL");
    if (!doc)
        throw new Error("A guild with this ID was not found!");
    yield counters_1.default.findOneAndUpdate({ guildId }, payload, { new: true });
    return doc;
});
exports.updateSettings = updateSettings;
const updateChannel = (guildId, channelId) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield counters_1.default.findOne({ guildId }, "-id -__v");
    if (!doc)
        throw new Error("A guild with this ID was not found!");
    const url = new URL(doc.webhookURL);
    const splitted_url = url.pathname.split("/webhooks/")[1].split("/");
    const webhook_id = splitted_url[0];
    const webhook_secret = splitted_url[1];
    yield deleteWebhook(webhook_id, webhook_secret);
    const webhook = yield createWebhook(guildId, channelId);
    yield counters_1.default.findOneAndUpdate({ guildId }, { $set: { channelId, webhookURL: webhook === null || webhook === void 0 ? void 0 : webhook.url } }, { new: true });
    return doc;
});
exports.updateChannel = updateChannel;
const createWebhook = (guildId, channelId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const webhook = (_a = __1.client.guilds.cache.get(guildId)) === null || _a === void 0 ? void 0 : _a.channels.createWebhook({
        channel: channelId,
        name: "Counter++",
    });
    return webhook;
});
const deleteWebhook = (webhookId, webhookSecret) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        __1.client.deleteWebhook(webhookId, {
            token: webhookSecret,
        });
    }
    catch (err) {
        (0, logger_1.error)(err);
    }
});
const createCounter = (guildId, channelId) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield counters_1.default.findOne({ guildId }, "-id -__v -webhookURL");
    if (doc)
        throw new Error("You've already setup a counter for this guild!");
    const webhook = yield createWebhook(guildId, channelId);
    const data = new counters_1.default({
        banOnError: false,
        dontAllowSameUser: true,
        resetOnError: false,
        lastMessage: null,
        webhookURL: webhook === null || webhook === void 0 ? void 0 : webhook.url,
        channelId,
        bannedIds: [],
        guildId,
    }).save();
    return data;
});
exports.createCounter = createCounter;
const resetChannelData = (guildId) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield counters_1.default.findOne({ guildId }, "-id -__v -webhookURL");
    if (!doc)
        throw new Error("A guild with this ID was not found!");
    yield counters_1.default.findOneAndUpdate({ guildId }, { $set: { lastMessage: null } }, { new: true });
    return doc;
});
exports.resetChannelData = resetChannelData;
const deleteGuildData = (guildId) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield counters_1.default.findOne({ guildId }, "-id -__v -webhookURL");
    if (!doc)
        throw new Error("A guild with this ID was not found!");
    const url = new URL(doc.webhookURL);
    const splitted_url = url.pathname.split("/webhooks/")[1].split("/");
    const webhook_id = splitted_url[0];
    const webhook_secret = splitted_url[1];
    yield deleteWebhook(webhook_id, webhook_secret);
    yield counters_1.default.findOneAndDelete({ guildId });
    return doc;
});
exports.deleteGuildData = deleteGuildData;
const getChannelBans = (guildId) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield counters_1.default.findOne({ guildId }, "-id -__v -webhookURL");
    if (!doc)
        throw new Error("A guild with this ID was not found!");
    return doc.bannedIds;
});
exports.getChannelBans = getChannelBans;
const unbanUserById = (guildId, discordId) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield counters_1.default.findOne({ guildId }, "-id -__v -webhookURL");
    if (!doc)
        throw new Error("A guild with this ID was not found!");
    yield counters_1.default.findOneAndUpdate({ guildId }, { $pull: { bannedIds: { id: discordId } } }, { new: true });
    return doc;
});
exports.unbanUserById = unbanUserById;
