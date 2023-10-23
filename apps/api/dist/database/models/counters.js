"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = (0, mongoose_1.model)("counters", new mongoose_1.Schema({
    bannedIds: Array,
    guildId: String,
    channelId: String,
    lastMessage: Object,
    resetOnError: Boolean,
    dontAllowSameUser: Boolean,
    banOnError: Boolean,
    webhookURL: { type: String, required: true },
}));
