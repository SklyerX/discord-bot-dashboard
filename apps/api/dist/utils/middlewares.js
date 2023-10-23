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
exports.ensureGuildPermission = exports.isAuthenticated = void 0;
const guilds_1 = require("../services/guilds");
const crypto_1 = require("./crypto");
const helpers_1 = require("./helpers");
function isAuthenticated(req, res, next) {
    return req.session.user ? next() : res.status(401).send("Unauthorized");
}
exports.isAuthenticated = isAuthenticated;
function ensureGuildPermission(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const decryptedAccessToken = (0, crypto_1.decrypt)(req.session.user.accessToken);
        yield (0, helpers_1.sleep)(500);
        const { data: userGuilds } = yield (0, guilds_1.retrieveUserGuilds)(decryptedAccessToken);
        const userGuild = userGuilds.find((guild) => guild.id === req.params.id);
        if (!userGuild)
            return res
                .status(404)
                .send({ message: "A guild with this ID was not found" });
        if ((+userGuild.permissions & 0x8) === 0x8) {
            next();
        }
        else {
            return res
                .status(403)
                .send({ message: "You don't have permission to view this guild!" });
        }
    });
}
exports.ensureGuildPermission = ensureGuildPermission;
