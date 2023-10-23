import { Skeleton } from "../ui/skeleton";

export default function GuildsSkeleton() {
  return (
    <div className="w-64">
      <Skeleton className="w-64 h-36" />
      <div className="flex items-center justify-between mt-3">
        <div>
          <Skeleton className="w-16 h-6" />
          <Skeleton className="w-14 h-5 mt-1" />
        </div>
        <Skeleton className="w-16 h-10" />
      </div>
    </div>
  );
}
