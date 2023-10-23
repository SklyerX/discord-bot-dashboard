"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.buildUser = exports.buildOAuth2RequestPayload = exports.buildOAuth2CredentialsRequestForm = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URL } = process.env;
const buildOAuth2CredentialsRequestForm = (code) => ({
    client_id: DISCORD_CLIENT_ID || "",
    client_secret: DISCORD_CLIENT_SECRET || "",
    grant_type: "authorization_code",
    redirect_uri: DISCORD_REDIRECT_URL || "",
    code,
});
exports.buildOAuth2CredentialsRequestForm = buildOAuth2CredentialsRequestForm;
const buildOAuth2RequestPayload = (data) => new URLSearchParams(data);
exports.buildOAuth2RequestPayload = buildOAuth2RequestPayload;
const buildUser = (user, credentials) => ({
    discordId: user.id,
    username: user.username,
    discriminator: user.discriminator,
    avatar: user.avatar,
    accessToken: credentials.accessToken,
    refreshToken: credentials.refreshToken,
});
exports.buildUser = buildUser;
const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
exports.sleep = sleep;
