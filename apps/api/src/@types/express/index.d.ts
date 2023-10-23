import "express";
import { UserSchema } from "../../utils/types";

declare module "express" {
  interface Request {
    user?: UserSchema;
  }
}
