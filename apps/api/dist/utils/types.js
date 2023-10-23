"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DISCORD_API_ROUTES = void 0;
var DISCORD_API_ROUTES;
(function (DISCORD_API_ROUTES) {
    DISCORD_API_ROUTES["RETRIEVE_TOKEN"] = "https://discord.com/api/v10/oauth2/token";
    DISCORD_API_ROUTES["USER_ENDPOINT"] = "https://discord.com/api/v10/users/@me";
    DISCORD_API_ROUTES["REVOKE_TOKEN"] = "https://discord.com/api/v10/oauth2/token/revoke";
    DISCORD_API_ROUTES["BASE"] = "https://discord.com/api/v10";
})(DISCORD_API_ROUTES || (exports.DISCORD_API_ROUTES = DISCORD_API_ROUTES = {}));
