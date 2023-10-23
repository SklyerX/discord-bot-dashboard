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
exports.revokeAccessToken = exports.updateUser = exports.createUser = exports.getDiscordUserDetails = exports.exchangeAccessCodeForCredentials = void 0;
const axios_1 = __importDefault(require("axios"));
const url_1 = __importDefault(require("url"));
const user_1 = __importDefault(require("../../database/models/user"));
const constants_1 = require("../../utils/constants");
const helpers_1 = require("../../utils/helpers");
const types_1 = require("../../utils/types");
const crypto_1 = require("../../utils/crypto");
function exchangeAccessCodeForCredentials(data) {
    const payload = (0, helpers_1.buildOAuth2RequestPayload)(data);
    return axios_1.default.post(types_1.DISCORD_API_ROUTES.RETRIEVE_TOKEN, payload, constants_1.axiosConfig);
}
exports.exchangeAccessCodeForCredentials = exchangeAccessCodeForCredentials;
function getDiscordUserDetails(access_token) {
    return axios_1.default.get(types_1.DISCORD_API_ROUTES.USER_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
}
exports.getDiscordUserDetails = getDiscordUserDetails;
function createUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const dbUser = yield user_1.default.findOne({ discordId: data.discordId });
        if (dbUser) {
            const updatedUser = yield updateUser(data);
            return updatedUser;
        }
        const newUser = new user_1.default(data).save();
        return newUser;
    });
}
exports.createUser = createUser;
function updateUser(params) {
    return __awaiter(this, void 0, void 0, function* () {
        return user_1.default.findOneAndUpdate({ discordId: params.discordId }, { $set: Object.assign({}, params) }, { new: true });
    });
}
exports.updateUser = updateUser;
function revokeAccessToken(access_token) {
    return __awaiter(this, void 0, void 0, function* () {
        const decryptedToken = (0, crypto_1.decrypt)(access_token).toString();
        const form_data = new url_1.default.URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            token: decryptedToken,
        });
        return axios_1.default.post(types_1.DISCORD_API_ROUTES.REVOKE_TOKEN, form_data.toString(), constants_1.axiosConfig);
    });
}
exports.revokeAccessToken = revokeAccessToken;
