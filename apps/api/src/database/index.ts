import { connect } from "mongoose";
import { debug } from "../utils/logger";

connect(process.env.MONGODB_CONNECTION_STRING_URI!).then(() => {
  debug(`Successfully connected to the database`);
});
