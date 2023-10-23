import { Router } from "express";
import auth from "./auth";
import guilds from "./guilds";

const router = Router();

router.use("/auth", auth);
router.use("/guilds", guilds);

export default router;
