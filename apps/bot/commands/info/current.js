const {
  Client,
  CommandInteraction,
  ApplicationCommandType,
} = require("discord.js");
const counters = require("../../models/counters");

module.exports = {
  name: "current",
  description: "Get the current counting channel",
  type: ApplicationCommandType.ChatInput,
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    const doc = await counters.findOne({ guildId: interaction.guild.id });

    interaction.reply({
      content: doc
        ? `The counting channel is <#${doc.channelId}>`
        : `Counting channel has not been set`,
      ephemeral: true,
    });
  },
};
