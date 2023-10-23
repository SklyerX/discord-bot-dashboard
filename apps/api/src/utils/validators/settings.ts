import { z } from "zod";

export const SettingsValidator = z.object({
  resetOnError: z.boolean().optional(),
  dontAllowSameUser: z.boolean().optional(),
  banOnError: z.boolean().optional(),
});

export type SettingsCredentials = z.infer<typeof SettingsValidator>;
