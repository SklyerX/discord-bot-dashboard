"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../../utils/middlewares");
const guilds_1 = require("../../controllers/guilds");
const router = (0, express_1.Router)();
router.get("/", middlewares_1.isAuthenticated, guilds_1.getGuildsController);
router.get("/:id/channels", middlewares_1.isAuthenticated, middlewares_1.ensureGuildPermission, guilds_1.getGuildChannelsController);
router.get("/:id/settings", middlewares_1.isAuthenticated, middlewares_1.ensureGuildPermission, guilds_1.getGuildSettings);
router.patch("/:id/settings", middlewares_1.isAuthenticated, middlewares_1.ensureGuildPermission, guilds_1.updateGuildSettings);
router.patch("/:id/channel", middlewares_1.isAuthenticated, middlewares_1.ensureGuildPermission, guilds_1.moveChannel);
router.post("/:id/channel", middlewares_1.isAuthenticated, middlewares_1.ensureGuildPermission, guilds_1.setupCounter);
router.delete("/:id/reset", middlewares_1.isAuthenticated, middlewares_1.ensureGuildPermission, guilds_1.resetInfo);
router.delete("/:id/delete", middlewares_1.isAuthenticated, middlewares_1.ensureGuildPermission, guilds_1.deleteGuildInfo);
router.get("/:id/bans", middlewares_1.isAuthenticated, middlewares_1.ensureGuildPermission, guilds_1.getBans);
router.delete("/:id/bans/:discordId", middlewares_1.isAuthenticated, middlewares_1.ensureGuildPermission, guilds_1.unbanUser);
exports.default = router;
