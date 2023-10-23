"use client";

import Setup from "@/components/Setup";
import BanOnError from "@/components/bot/BanOnError";
import DontAllowSameUser from "@/components/bot/DontAllowSameUser";
import ResetOnError from "@/components/bot/ResetOnError";
import SaveChanges from "@/components/bot/SaveChanges";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import MigrateChannel from "@/components/modals/MigrateChannel";
import ResetCounter from "@/components/modals/ResetCounter";
import { buttonVariants } from "@/components/ui/button";
import getSettings from "@/hooks/react-query/get-guilds-settings";
import { useConfigStore } from "@/states/config";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Toaster } from "sonner";

export default function Dashboard() {
  const { data, isLoading } = getSettings();
  const { data: settings } = useConfigStore();

  const params = useParams();

  return (
    <DashboardLayout>
      <Toaster position="bottom-center" />
      <h1 className="text-2xl font-medium">Settings & Analytics</h1>
      <p className="text-muted-foreground text-sm">
        Here are all the settings and statistics for your server
      </p>
      {isLoading ? (
        <div className="w-full h-96 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div className="mt-10 mb-10">
          {data ? (
            <>
              <div className="border rounded-md p-4 flex items-center justify-between max-w-[480px]">
                <h4 className="text-lg font-medium">Current Count</h4>
                {data?.lastMessage ? (
                  <p>{data.lastMessage.content}</p>
                ) : (
                  <p>0</p>
                )}
              </div>
              <div className="mt-10 space-y-4">
                <BanOnError value={data?.banOnError} />
                <DontAllowSameUser value={data?.dontAllowSameUser} />
                <ResetOnError value={data?.resetOnError} />
              </div>
              {settings && Object.keys(settings).length !== 0 ? (
                <SaveChanges />
              ) : null}
              <div className="mt-10">
                <h3 className="text-xl font-medium">
                  Migrate Counting Channel
                </h3>
                <p className="text-muted-foreground text-sm">
                  Change your current counting channel to another one
                </p>
                <div className="mt-5">
                  <MigrateChannel id={data.channelId} />
                </div>
              </div>
              <div className="mt-10">
                <h3 className="text-xl font-medium">Banned Users</h3>
                <p className="text-muted-foreground text-sm">
                  View all the users that have been banned from the counting
                  game in your server.
                </p>
                <div className="mt-5">
                  <Link
                    href={`/dashboard/${params.id}/bans`}
                    className={buttonVariants({ variant: "default" })}
                  >
                    View Bans
                  </Link>
                </div>
              </div>
              <div className="mt-10 border border-red-500 rounded-md relative p-5">
                <div className="absolute -top-4 px-3 left-5 bg-background">
                  <h3 className="text-red-500 text-xl">Danger Zone</h3>
                </div>
                <div className="flex flex-row items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium">Reset Counter</h4>
                    <p className="text-sm text-muted-foreground">
                      Reset the counter and start again at <strong>0</strong>
                    </p>
                  </div>
                  <ResetCounter
                    currentCount={
                      data?.lastMessage ? data?.lastMessage.content : 0
                    }
                  />
                </div>
              </div>
            </>
          ) : (
            <Setup />
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
