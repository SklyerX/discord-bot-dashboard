import { PartialGuild } from "@/utils/types";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";
import {
  API_ENDPOINT,
  DISCORD_CLIENT_ID,
  REDIRECT_URL,
} from "@/utils/constants";

interface Props {
  guild: PartialGuild;
}

export default function GuildCard({ guild }: Props) {
  return (
    <div className="w-80 h-44">
      <div className="w-full h-full object-cover relative">
        {guild.icon ? (
          <img
            src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.jpg`}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-full rounded-md bg-input"></div>
        )}
        <div className="absolute top-0 left-0 w-full h-full bg-foreground/30 backdrop-blur-sm grid place-items-center rounded-md">
          {guild.icon ? (
            <img
              src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.jpg`}
              className="w-20 h-20 rounded-full border"
            />
          ) : (
            <div className="w-20 h-20 text-lg rounded-full border grid place-items-center">
              {guild.name.substring(0, 1).toUpperCase()}
            </div>
          )}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">{guild.name}</h3>
          <span className="text-xs text-muted-foreground">
            {guild.owner ? "Owner" : "Bot Master"}
          </span>
        </div>
        {guild.bot ? (
          <Link
            href={`/dashboard/${guild.id}`}
            className={buttonVariants({
              className: "w-16",
              variant: "default",
            })}
          >
            Go
          </Link>
        ) : (
          <Link
            href={`https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&permissions=536947712&scope=bot&guild_id=${guild.id}`}
            className={buttonVariants({
              className: "w-16",
              variant: "secondary",
            })}
          >
            Setup
          </Link>
        )}
      </div>
    </div>
  );
}
