import { API_ENDPOINT } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function unbanUser() {
  const params = useParams();

  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const { data } = await axios.delete(
        `${API_ENDPOINT}/guilds/${params.id}/bans/${userId}`,
        { withCredentials: true }
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Unbanned!");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response && typeof err.response.data === "string")
          return toast.error(err.response.data);

        return toast.error("Something went wrong while unbanning user!");
      }

      toast.error(
        "Something went wrong while unbanning user! Please try again later."
      );
    },
  });
}
