import { API_ENDPOINT } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function migrateChannel() {
  const params = useParams();

  return useMutation({
    mutationFn: async ({ channelId }: { channelId: string }) => {
      const { data } = await axios.patch(
        `${API_ENDPOINT}/guilds/${params.id}/channel`,
        { channelId },
        { withCredentials: true }
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Migrated channel!");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response && typeof err.response.data === "string")
          return toast.error(err.response.data);

        return toast.error("Something went wrong while migrating channels!");
      }

      toast.error(
        "Something went wrong while migrating channels! Please try again later."
      );
    },
  });
}
