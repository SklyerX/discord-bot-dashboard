import { Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import signOut from "@/hooks/react-query/sign-user-out";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";

interface Props {
  avatarURL?: string;
  username?: string;
  isLoading: boolean;
}

export default function DashboardNavbar({
  avatarURL,
  username,
  isLoading,
}: Props) {
  const { mutate, isLoading: isSigningOut, isSuccess } = signOut();

  const handleSignout = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    mutate();
  };

  useEffect(() => {
    if (isSuccess) {
      redirect("/");
    }
  }, [isSuccess]);

  return (
    <div className="container flex items-center justify-between mt-10">
      <Link href="/dashboard" className="text-xl font-medium">
        Counter++
      </Link>
      {isLoading ? (
        <Loader2 className="w-6 h-6 animate-spin" />
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <img src={avatarURL} className="w-10 h-10 rounded-full" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{username}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={(e) => handleSignout(e)}>
              {isSigningOut ? (
                <div className="flex items-center gap-2">
                  <span>Signing Out</span>
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              ) : (
                <p>Sign Out</p>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
