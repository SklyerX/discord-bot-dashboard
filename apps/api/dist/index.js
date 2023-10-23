"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.client = void 0;
const chalk_1 = __importDefault(require("chalk"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const discord_js_1 = require("discord.js");
const routes_1 = __importDefault(require("./routes"));
const logger_1 = require("./utils/logger");
(0, dotenv_1.config)();
require("./database");
const PORT = process.env.PORT || 8888;
const client = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.GuildWebhooks] });
exports.client = client;
client.on(discord_js_1.Events.ClientReady, () => (0, logger_1.info)(`[ API ] Bot logged in`));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        try {
            app.use((0, cors_1.default)({
                origin: ["http://localhost:3000", "https://discord.com"],
                credentials: true,
            }));
            app.use((0, cookie_parser_1.default)());
            app.use(express_1.default.json());
            app.use((0, express_session_1.default)({
                secret: process.env.COOKIE_SECRET,
                name: process.env.COOKIE_NAME,
                resave: false,
                saveUninitialized: false,
                store: new connect_mongo_1.default({
                    mongoUrl: process.env.MONGODB_CONNECTION_STRING_URI,
                    collectionName: "sessions",
                }),
                cookie: {
                    path: "/",
                    httpOnly: true,
                    secure: false,
                    maxAge: 3600000 * 24,
                },
            }));
            app.use("/api", routes_1.default);
            const { deserializeSession } = yield Promise.resolve().then(() => __importStar(require("./utils/session")));
            app.use((req, res, next) => deserializeSession(req, res, next));
            app.use((req, res, next) => setTimeout(() => next(), 1000));
            app.listen(PORT, () => (0, logger_1.debug)(`Observing requests at: ${chalk_1.default.underline(`http://localhost:${PORT}`)}`));
            client.login(process.env.DISCORD_BOT_TOKEN);
        }
        catch (err) {
            console.error(err);
        }
    });
}
main();
process.on("uncaughtException", (reason, origin) => {
    (0, logger_1.error)(reason, `Origin:`, origin);
});
process.on("uncaughtExceptionMonitor", (reason, origin) => {
    (0, logger_1.error)(reason, `Origin:`, origin);
});
process.on("unhandledRejection", (reason) => {
    (0, logger_1.error)(reason);
});
