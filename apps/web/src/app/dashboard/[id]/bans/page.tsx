"use client";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import getBans from "@/hooks/react-query/get-bans";
import UnbanDropdown from "@/components/UnbanDropdown";
import { BannedUser } from "@/utils/types";
import { ChevronLeft, Ghost, MoreVertical, Sliders } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Toaster } from "sonner";

interface ISearch {
  by: "id" | "name";
  query: string;
}

export default function Bans() {
  const params = useParams();
  const { data, isLoading, isRefetching, isSuccess, refetch } = getBans();

  const [search, setSearch] = useState<ISearch>({
    by: "name",
    query: "",
  });

  const [bans, setBans] = useState<BannedUser[]>([]);

  useEffect(() => {
    if (isSuccess) {
      setBans(data);
    }
  }, [isSuccess]);

  const filteredBans = useMemo(() => {
    return bans.filter((item) => {
      return item[search.by].toLowerCase().includes(search.query.toLowerCase());
    });
  }, [bans, search.query]);

  return (
    <DashboardLayout>
      <Toaster position="bottom-center" />
      <Link
        href={`/dashboard/${params.id}`}
        className="flex items-center gap-1 group hover:gap-2 transition-all"
      >
        <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
        <span className="text-sm text-muted-foreground group-hover:text-foreground">
          Go Back
        </span>
      </Link>
      <div className="mt-5">
        <h3 className="text-xl font-medium">Bans</h3>
        <p className="text-muted-foreground text-sm">
          Here are all the people that have been banned from your counting
          channel
        </p>
        <div className="mt-5 relative">
          <Input
            value={search.query}
            placeholder={`Search by ${search.by}`}
            onChange={({ target }) =>
              setSearch((prev) => ({ ...prev, query: target.value }))
            }
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="absolute right-2 top-2.5">
                <Sliders className="w-4 h-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={search.by}
                onValueChange={(e) =>
                  setSearch((prev) => ({ ...prev, by: e as "id" | "name" }))
                }
              >
                <DropdownMenuRadioItem value="id">id</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="name">name</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-5">
          {!isLoading &&
            !isRefetching &&
            filteredBans?.map((user) => (
              <div className="w-full flex items-center justify-between border-b py-4">
                <div className="flex items-center gap-2">
                  <img src={user.avatar} className="w-10 h-10 rounded-full" />
                  <p className="font-medium text-lg">
                    {user.name}{" "}
                    <span className="text-sm font-normal">({user.id})</span>
                  </p>
                </div>
                <UnbanDropdown
                  userId={user.id}
                  onChange={() => {
                    refetch().then((res) => {
                      setBans(res.data || []);
                    });
                  }}
                />
              </div>
            ))}
          {isLoading || isRefetching ? (
            <>
              <Skeleton className="w-full h-14" />
              <Skeleton className="w-full h-14 mt-2" />
              <Skeleton className="w-full h-14 mt-2" />
              <Skeleton className="w-full h-14 mt-2" />
            </>
          ) : null}
          {!isLoading && !isRefetching && bans.length === 0 ? (
            <div className="w-full h-72 flex flex-col items-center justify-center border border-dashed rounded-md">
              <Ghost className="w-5 h-5" />
              <h3 className="text-lg font-medium">Pretty empty here</h3>
              <p className="text-sm text-muted-foreground">
                You'll know if someone gets banned if you visit this page
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </DashboardLayout>
  );
}
