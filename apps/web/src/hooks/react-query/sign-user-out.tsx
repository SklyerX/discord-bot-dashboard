import { API_ENDPOINT } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { redirect, useParams } from "next/navigation";
import { toast } from "sonner";

export default function signOut() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.post(`${API_ENDPOINT}/auth/signout`, null, {
        withCredentials: true,
      });
      return data;
    },
    onSuccess: () => {
      redirect("/");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response && typeof err.response.data === "string")
          return toast.error(err.response.data);

        return toast.error("Something went wrong while signing you out!");
      }

      toast.error(
        "Something went wrong while signing you out! Please try again later."
      );
    },
  });
}
