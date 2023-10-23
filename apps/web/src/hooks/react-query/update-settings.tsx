import { Payload } from "@/states/config";
import { API_ENDPOINT } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function updateSettings() {
  const params = useParams();

  return useMutation({
    mutationFn: async ({ ...fields }: Payload) => {
      const { data } = await axios.patch(
        `${API_ENDPOINT}/guilds/${params.id}/settings`,
        { ...fields },
        { withCredentials: true }
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Saved!");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response && typeof err.response.data === "string")
          return toast.error(err.response.data);

        return toast.error("Something went wrong while updating settings!");
      }

      toast.error(
        "Something went wrong while updating settings! Please try again later."
      );
    },
  });
}
