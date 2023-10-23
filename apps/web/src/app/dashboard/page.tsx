"use client";

import GuildCard from "@/components/GuildCard";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import GuildsSkeleton from "@/components/skeletons/guilds";
import getGuilds from "@/hooks/react-query/get-guilds";
import { Toaster } from "sonner";

export default function Page() {
  const { data, isLoading } = getGuilds();

  return (
    <DashboardLayout>
      <div className="pb-20">
        <Toaster position="bottom-center" />
        <div className="grid place-items-center">
          <h3 className="text-2xl font-medium">Select a server</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 place-items-center lg:grid-cols-3 gap-20 mt-10">
          {isLoading ? (
            <>
              <GuildsSkeleton />
              <GuildsSkeleton />
              <GuildsSkeleton />
            </>
          ) : (
            <>
              {data?.map((guild, index) => (
                <GuildCard guild={guild} key={index} />
              ))}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
