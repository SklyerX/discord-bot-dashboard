import { Schema, model } from "mongoose";

export default model(
  "users",
  new Schema({
    discordId: String,
    tag: String,
    avatar: String,
    username: String,
    accessToken: String,
    refreshToken: String,
  })
);
