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
exports.signUserOut = exports.getAuthenticatedUser = exports.authDiscordRedirectController = void 0;
const axios_1 = require("axios");
const auth_1 = require("../../services/auth");
const crypto_1 = require("../../utils/crypto");
const helpers_1 = require("../../utils/helpers");
const logger_1 = require("../../utils/logger");
const session_1 = require("../../utils/session");
function authDiscordRedirectController(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { code } = req.query;
        if (code) {
            try {
                const payload = (0, helpers_1.buildOAuth2CredentialsRequestForm)(code.toString());
                const { data: credentials } = yield (0, auth_1.exchangeAccessCodeForCredentials)(payload);
                const { access_token, refresh_token } = credentials;
                const { data: user } = yield (0, auth_1.getDiscordUserDetails)(access_token);
                const encryptedAccessToken = (0, crypto_1.encrypt)(access_token);
                const encryptedRefreshToken = (0, crypto_1.encrypt)(refresh_token);
                (0, logger_1.info)(access_token);
                (0, logger_1.info)(refresh_token);
                const newUser = yield (0, auth_1.createUser)({
                    accessToken: encryptedAccessToken,
                    refreshToken: encryptedRefreshToken,
                    avatar: user.avatar,
                    discordId: user.id,
                    discriminator: user.discriminator,
                    username: user.username,
                });
                yield (0, session_1.serializeSession)(req, newUser);
                res.redirect(`${process.env.ACTUAL_SITE}/dashboard`);
            }
            catch (err) {
                if (err instanceof axios_1.AxiosError) {
                    (0, logger_1.error)((_a = err.response) === null || _a === void 0 ? void 0 : _a.data);
                }
            }
        }
    });
}
exports.authDiscordRedirectController = authDiscordRedirectController;
function getAuthenticatedUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return req.session.user
            ? res.send(req.session.user)
            : res.status(401).send("Unauthorized");
    });
}
exports.getAuthenticatedUser = getAuthenticatedUser;
function signUserOut(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, auth_1.revokeAccessToken)(req.session.user.accessToken);
            req.session.destroy((err) => {
                if (err) {
                    (0, logger_1.error)("Error destroying session:", err);
                }
                else {
                    (0, logger_1.info)("Session destroyed");
                }
            });
            res.redirect(process.env.ACTUAL_SITE);
        }
        catch (err) {
            (0, logger_1.error)(err);
            res.status(400).send(err);
        }
    });
}
exports.signUserOut = signUserOut;
