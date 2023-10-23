import { Router } from "express";
import {
  authDiscordRedirectController,
  getAuthenticatedUser,
  signUserOut,
} from "../../controllers/auth";
import { isAuthenticated } from "../../utils/middlewares";

const router = Router();

router.get("/discord/redirect", authDiscordRedirectController);
router.post("/signout", isAuthenticated, signUserOut);
router.get("/user", getAuthenticatedUser);

export default router;
