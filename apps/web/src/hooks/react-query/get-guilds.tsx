import { API_ENDPOINT } from "@/utils/constants";
import { PartialGuild } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

export default function getGuilds() {
  return useQuery({
    queryKey: ["guilds"],
    refetchOnWindowFocus: false,
    retry: 1,
    queryFn: async () => {
      const { data } = await axios.get<PartialGuild[]>(
        `${API_ENDPOINT}/guilds`,
        {
          withCredentials: true,
        }
      );
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response && typeof err.response.data === "string")
          return toast.error(err.response.data);

        return toast.error("Something went wrong while fetching guilds!");
      }

      toast.error(
        "Something went wrong while fetching guilds! Please try again later."
      );
    },
  });
}
