const {
  Client,
  CommandInteraction,
  ApplicationCommandType,
} = require("discord.js");

module.exports = {
  name: "dashboard",
  description: "Get a direct link to the dashboard",
  type: ApplicationCommandType.ChatInput,
  userPerms: ["ADMINISTRATOR"],
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    await interaction.reply({
      content: `[visit](https://counter.skylerx.ir/dashboard/${interaction.guild.id})`,
    });
  },
};
