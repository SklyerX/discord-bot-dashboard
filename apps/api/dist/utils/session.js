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
exports.deserializeSession = exports.serializeSession = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const session_1 = __importDefault(require("../database/models/session"));
function serializeSession(req, user) {
    return __awaiter(this, void 0, void 0, function* () {
        req.session.user = user;
        req.user = user;
        return req.user;
    });
}
exports.serializeSession = serializeSession;
function deserializeSession(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { DISCORD_OAUTH2_SESSION_ID } = req.cookies;
        if (!DISCORD_OAUTH2_SESSION_ID)
            return next();
        const sessionId = cookie_parser_1.default
            .signedCookie(DISCORD_OAUTH2_SESSION_ID, process.env.COOKIE_SECRET)
            .toString();
        const sessionDB = yield session_1.default.findOne({
            _id: sessionId,
        });
        console.log(sessionId);
        if (!sessionDB) {
            console.log("No Session");
            return next();
        }
        const currentTime = new Date();
        if (sessionDB.expiresAt < currentTime) {
            console.log("Session Expired");
            yield session_1.default.deleteOne({ sessionId: sessionDB._id });
            console.log("Session Deleted");
        }
        else {
            console.log("Session Not Expired");
            const data = JSON.parse((_a = sessionDB.session) === null || _a === void 0 ? void 0 : _a.toString());
            req.user = data;
        }
        next();
    });
}
exports.deserializeSession = deserializeSession;
