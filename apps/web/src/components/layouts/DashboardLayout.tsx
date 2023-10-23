import useSession from "@/hooks/useSession";
import DashboardNavbar from "../misc/DashboardNavbar";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const { isLoading, user } = useSession({ redirectOnAuthFailure: true });

  return (
    <>
      <DashboardNavbar
        avatarURL={`https://cdn.discordapp.com/avatars/${user?.discordId}/${user?.avatar}.webp?size=240`}
        isLoading={isLoading}
        username={user?.username}
      />
      <div className="mt-10 container">{children}</div>
    </>
  );
}
