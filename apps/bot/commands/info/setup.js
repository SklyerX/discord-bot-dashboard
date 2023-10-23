const {
  Client,
  CommandInteraction,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  EmbedBuilder,
} = require("discord.js");
const counters = require("../../models/counters");

module.exports = {
  name: "setup",
  description: "setup the counting channel",
  type: ApplicationCommandType.ChatInput,
  userPerms: ["ADMINISTRATOR"],
  options: [
    {
      name: "channel",
      description: "The channel in which people count",
      type: ApplicationCommandOptionType.Channel,
      channelTypes: [ApplicationCommandOptionType.Channel],
      required: true,
    },
  ],
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    const doc = await counters.findOne({ guildId: interaction.guild.id });

    if (doc)
      return interaction.reply({
        content: `There is already a counter channel set! (<#${doc.channelId}>) to change this please visit the [dashboard](https://counter.skylerx.ir/dashboard/${interaction.guild.id})`,
      });

    const channel = interaction.options.getChannel("channel");

    const webhook = await channel.createWebhook("Counter", {
      avatar: client.user.displayAvatarURL({ dynamic: true }),
      name: client.user.username,
      reason: `Setup by [${interaction.user.username}] [${interaction.user.id}]`,
    });

    new counters({
      banOnError: false,
      channelId: channel.id,
      guildId: interaction.guild.id,
      webhookURL: webhook.url,
      dontAllowSameUser: false,
      lastMessage: null,
      resetOnError: false,
      bannedIds: [],
    }).save();

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setTitle("Successfully set!")
          .setDescription(
            `The counting channel has been set to <#${channel.id}>`
          ),
      ],
    });
  },
};
