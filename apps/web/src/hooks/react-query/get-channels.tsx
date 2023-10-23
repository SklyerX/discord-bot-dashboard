import { API_ENDPOINT } from "@/utils/constants";
import { PartialChannel } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function getChannels() {
  const params = useParams();
  return useQuery({
    queryKey: ["channels"],
    refetchOnWindowFocus: false,
    retry: 1,
    queryFn: async () => {
      const { data } = await axios.get<PartialChannel[]>(
        `${API_ENDPOINT}/guilds/${params.id}/channels`,
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
          "Something went wrong while fetching your servers channels!"
        );
      }

      toast.error(
        "Something went wrong while fetching your servers channels! Please try again later."
      );
    },
  });
}
