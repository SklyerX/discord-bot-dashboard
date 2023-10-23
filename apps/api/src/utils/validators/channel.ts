import { z } from "zod";

export const ChannelValidator = z.object({
  channelId: z.string(),
});
