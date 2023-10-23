const { glob } = require("glob");
const { promisify } = require("util");
const { Client, Events } = require("discord.js");
const mongoose = require("mongoose");

const globPromise = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async (client) => {
  // Events
  const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
  eventFiles.map((value) => require(value));

  // Slash Commands
  const slashCommands = await globPromise(`${process.cwd()}/commands/*/*.js`);

  const arrayOfSlashCommands = [];
  slashCommands.map((value) => {
    const file = require(value);
    if (!file?.name) return;
    client.slashCommands.set(file.name, file);

    if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
    arrayOfSlashCommands.push(file);
  });
  client.rest.on(Events.ClientReady, async () => {
    // Register for a single guild
    await client.guilds.cache
      .get(process.env.DEVELOPMENT_GUILD_ID)
      .commands.set(arrayOfSlashCommands);

    // Register for all the guilds the bot is in
    await client.application.commands.set(arrayOfSlashCommands);
  });

  // mongoose
  const { mongooseConnectionString } = process.env;
  if (!mongooseConnectionString) return;

  mongoose
    .connect(mongooseConnectionString)
    .then(() => console.log("Connected to mongodb"));
};
