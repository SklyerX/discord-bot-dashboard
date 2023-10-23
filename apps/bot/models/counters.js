const { model, Schema } = require("mongoose");

module.exports = model(
  "counters",
  new Schema({
    bannedIds: Array,
    guildId: String,
    channelId: String,
    lastMessage: Object,
    resetOnError: Boolean,
    dontAllowSameUser: Boolean,
    banOnError: Boolean,
    webhookURL: String,
  })
);
