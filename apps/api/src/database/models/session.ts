import { Schema, model } from "mongoose";

export default model(
  "sessions",
  new Schema({
    _id: String,
    expiresAt: Date,
    session: String,
  })
);
