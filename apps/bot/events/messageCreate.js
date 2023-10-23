const {
  EmbedBuilder,
  WebhookClient,
  ChannelType,
  Events,
} = require("discord.js");
const client = require("../index");
const counters = require("../models/counters");

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || message.channel.type !== ChannelType.GuildText)
    return;

  const numberRegex = /\d/g;

  if (numberRegex.test(message.content) === false)
    return message.channel
      .send({ content: "Please make sure your message is a number" })
      .then((msg) => {
        setTimeout(async () => {
          await message.delete();
          await msg.delete();
        }, 3000);
      });

  try {
    const existingDb = await counters.findOne({
      channelId: message.channel.id,
    });

    if (!existingDb) return;

    const bannedUser = existingDb.bannedIds.find(
      (user) => user.id === message.author.id
    );

    if (bannedUser)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle("Banned")
            .setDescription(
              "You've been banned from participating in this counting game. If you think this is a mistake ask the admins to remove your name from the list of banned ids"
            ),
        ],
      });

    const webhook = new WebhookClient({ url: existingDb.webhookURL });

    if (existingDb.lastMessage) {
      if (
        existingDb.lastMessage.authorId === message.author.id &&
        existingDb.dontAllowSameUser
      ) {
        await message.delete();
        message.channel
          .send({ content: "Please wait your turn." })
          .then((msg) => {
            setTimeout(async () => {
              await msg.delete();
            }, 3000);
          });

        return;
      }
      if (existingDb.lastMessage.content + 1 !== +message.content) {
        if (existingDb.banOnError) {
          await counters.findOneAndUpdate(
            {
              guildId: message.guild.id,
              channelId: message.channel.id,
            },
            {
              $push: {
                bannedIds: {
                  id: message.author.id,
                  avatar: message.member.displayAvatarURL(),
                  name: message.author.globalName,
                },
              },
            },
            {
              new: true,
            }
          );

          await message.channel.send({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setTitle("Banned")
                .setDescription(
                  `You have broken the streak! The rules of the game indicate that you cannot break the streak or else you will be banned`
                )
                .setFooter({
                  text: `${message.author.username} Has broken the chain... And has been banned from participating in this game`,
                  iconURL: message.author.displayAvatarURL({ dynamic: true }),
                }),
            ],
          });
        }
        if (existingDb.resetOnError) {
          await message.delete();

          await counters.findOneAndUpdate(
            {
              guildId: message.guild.id,
              channelId: message.channel.id,
            },
            {
              lastMessage: null,
            },
            {
              new: true,
            }
          );

          await message.channel.send({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setTitle("Invalid number!")
                .setDescription(
                  `The number should be **${
                    existingDb.lastMessage.content + 1
                  }**`
                )
                .setFooter({
                  text: `${message.author.username} Has broken the chain... The starting number is 0`,
                  iconURL: message.author.displayAvatarURL({ dynamic: true }),
                }),
            ],
          });
        } else {
          await message.delete();
          await message.channel.send({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setTitle("Invalid number!")
                .setDescription(
                  `The number should be **${
                    existingDb.lastMessage.content + 1
                  }**`
                ),
            ],
          });
        }
      } else {
        await message.delete();
        await webhook.send({
          content: message.content,
          username: message.member.nickname || message.author.globalName,
          avatarURL: message.author.displayAvatarURL(),
        });
        await counters.findOneAndUpdate(
          {
            guildId: message.guild.id,
            channelId: message.channel.id,
          },
          {
            lastMessage: {
              authorId: message.author.id,
              content: +message.content,
            },
          }
        );
      }
    } else {
      if (+message.content !== 1)
        return message.channel.send({ content: "First number should be 1!" });
      await message.delete();
      await webhook.send({
        content: message.content,
        username: message.member.nickname || message.author.globalName,
        avatarURL: message.author.displayAvatarURL(),
      });
      await counters.findOneAndUpdate(
        {
          guildId: message.guild.id,
          channelId: message.channel.id,
        },
        {
          lastMessage: {
            authorId: message.author.id,
            content: 1,
          },
        },
        {
          new: true,
        }
      );
    }
  } catch (err) {
    await message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setTitle("Error")
          .setDescription(
            "Something went wrong while validating/parsing/handling count. Please try again later."
          )
          .addFields([{ name: "Error", value: `\`\`\`${err.message}\`\`\`` }]),
      ],
    });
  }
});
