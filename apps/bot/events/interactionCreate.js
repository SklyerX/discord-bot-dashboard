const { Events } = require("discord.js");
const client = require("../index");

client.on(Events.InteractionCreate, async (interaction) => {
  // Slash Command Handling
  if (interaction.isCommand()) {
    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd)
      return await interaction.reply({ content: "An error has occured " });

    const args = [];

    for (let option of interaction.options.data) {
      if (option.type === "SUB_COMMAND") {
        if (option.name) args.push(option.name);
        option.options?.forEach((x) => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }
    interaction.member = interaction.guild.members.cache.get(
      interaction.user.id
    );

    if (!interaction.member.permissions.has(cmd.userPerms || []))
      return interaction.reply({
        content: `You Dont Have \`${cmd.userPerms || []}\` Permission`,
        ephemeral: true,
      });

    cmd.run(client, interaction, args);
  }
});
