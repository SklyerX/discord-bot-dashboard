"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = (0, mongoose_1.model)("users", new mongoose_1.Schema({
    discordId: String,
    tag: String,
    avatar: String,
    username: String,
    accessToken: String,
    refreshToken: String,
}));
