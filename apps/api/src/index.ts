import chalk from "chalk";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import session from "express-session";
import { Client, GatewayIntentBits, Events } from "discord.js";

import routes from "./routes";
import { debug, error, info } from "./utils/logger";
config();

import "./database";

const PORT = process.env.PORT || 8888;

const client = new Client({ intents: [GatewayIntentBits.GuildWebhooks] });

client.on(Events.ClientReady, () => info(`[ API ] Bot logged in`));

async function main() {
  const app = express();
  try {
    app.use(
      cors({
        origin: ["http://localhost:3000", "https://discord.com"],
        credentials: true,
      })
    );
    app.use(cookieParser());
    app.use(express.json());
    app.use(
      session({
        secret: process.env.COOKIE_SECRET!,
        name: process.env.COOKIE_NAME!,
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({
          mongoUrl: process.env.MONGODB_CONNECTION_STRING_URI!,
          collectionName: "sessions",
        }),
        cookie: {
          path: "/",
          httpOnly: true,
          secure: false, // Set to true for HTTPS
          maxAge: 3600000 * 24,
        },
      })
    );
    app.use("/api", routes);

    const { deserializeSession } = await import("./utils/session");

    app.use((req, res, next) => deserializeSession(req, res, next));

    app.use((req, res, next) => setTimeout(() => next(), 1000));

    app.listen(PORT, () =>
      debug(
        `Observing requests at: ${chalk.underline(`http://localhost:${PORT}`)}`
      )
    );

    client.login(process.env.DISCORD_BOT_TOKEN);
  } catch (err) {
    console.error(err);
    // pretify error message plus output in the logs folder / send webhook data
  }
}

main();

process.on("uncaughtException", (reason, origin) => {
  error(reason, `Origin:`, origin);
});
process.on("uncaughtExceptionMonitor", (reason, origin) => {
  error(reason, `Origin:`, origin);
});
process.on("unhandledRejection", (reason) => {
  error(reason);
});

export { client };
