import { Router } from "express";
import {
  ensureGuildPermission,
  isAuthenticated,
} from "../../utils/middlewares";
import {
  deleteGuildInfo,
  getBans,
  getGuildChannelsController,
  getGuildSettings,
  getGuildsController,
  moveChannel,
  resetInfo,
  setupCounter,
  unbanUser,
  updateGuildSettings,
} from "../../controllers/guilds";

const router = Router();

router.get("/", isAuthenticated, getGuildsController);
router.get(
  "/:id/channels",
  isAuthenticated,
  ensureGuildPermission,
  getGuildChannelsController
);
router.get(
  "/:id/settings",
  isAuthenticated,
  ensureGuildPermission,
  getGuildSettings
);
router.patch(
  "/:id/settings",
  isAuthenticated,
  ensureGuildPermission,
  updateGuildSettings
);
router.patch(
  "/:id/channel",
  isAuthenticated,
  ensureGuildPermission,
  moveChannel
);
router.post(
  "/:id/channel",
  isAuthenticated,
  ensureGuildPermission,
  setupCounter
);
router.delete("/:id/reset", isAuthenticated, ensureGuildPermission, resetInfo);
router.delete(
  "/:id/delete",
  isAuthenticated,
  ensureGuildPermission,
  deleteGuildInfo
);

router.get("/:id/bans", isAuthenticated, ensureGuildPermission, getBans);

router.delete(
  "/:id/bans/:discordId",
  isAuthenticated,
  ensureGuildPermission,
  unbanUser
);

export default router;
