import { API_ENDPOINT } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function resetStreak() {
  const params = useParams();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(
        `${API_ENDPOINT}/guilds/${params.id}/reset`,
        { withCredentials: true }
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Reset!");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response && typeof err.response.data === "string")
          return toast.error(err.response.data);

        return toast.error("Something went wrong while reseting streak!");
      }

      toast.error(
        "Something went wrong while reseting streak! Please try again later."
      );
    },
  });
}
