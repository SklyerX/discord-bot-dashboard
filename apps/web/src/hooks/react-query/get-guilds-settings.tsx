import { API_ENDPOINT } from "@/utils/constants";
import { PartialGuild, Settings } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function getSettings() {
  const params = useParams();

  return useQuery({
    queryKey: ["settings"],
    refetchOnWindowFocus: false,
    retry: 1,
    queryFn: async () => {
      const { data } = await axios.get<Settings>(
        `${API_ENDPOINT}/guilds/${params.id}/settings`,
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

        return toast.error("Something went wrong while fetching settings!");
      }

      toast.error(
        "Something went wrong while fetching settings! Please try again later."
      );
    },
  });
}
