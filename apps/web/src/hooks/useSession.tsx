import { API_ENDPOINT, AUTH_ENDPOINT } from "@/utils/constants";
import { User } from "@/utils/types";
import axios, { AxiosError } from "axios";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  redirectOnAuthFailure?: boolean;
}

export default function useSession({ redirectOnAuthFailure = true }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    // call api and fetch user data
    const run = async () => {
      try {
        const { data } = await axios.get<User>(API_ENDPOINT, {
          withCredentials: true,
        });
        setUser(data);
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err.response?.status === 401 && redirectOnAuthFailure)
            return router.replace(AUTH_ENDPOINT);
        }
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, []);

  return { user, isLoading };
}
