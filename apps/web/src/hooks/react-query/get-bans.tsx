import { API_ENDPOINT } from "@/utils/constants";
import { BannedUser } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function getBans() {
  const params = useParams();

  return useQuery({
    queryKey: ["bans"],
    refetchOnWindowFocus: false,
    retry: 1,
    queryFn: async () => {
      const { data } = await axios.get<BannedUser[]>(
        `${API_ENDPOINT}/guilds/${params.id}/bans`,
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

        return toast.error(
          "Something went wrong while fetching banned members!"
        );
      }

      toast.error(
        "Something went wrong while fetching banned members! Please try again later."
      );
    },
  });
}
