const { Events } = require("discord.js");
const client = require("../index");

client.on(Events.ClientReady, () =>
  console.log(`${client.user.tag} is up and ready to go!`)
);
