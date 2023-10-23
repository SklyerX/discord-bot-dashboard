import { model, Schema } from "mongoose";

export default model(
  "counters",
  new Schema({
    bannedIds: Array,
    guildId: String,
    channelId: String,
    lastMessage: Object,
    resetOnError: Boolean,
    dontAllowSameUser: Boolean,
    banOnError: Boolean,
    webhookURL: { type: String, required: true },
  })
);
