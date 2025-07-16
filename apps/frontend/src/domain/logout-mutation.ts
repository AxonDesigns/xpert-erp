import { api } from "@frontend/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      console.log("logout");
      return await api.auth.logout.$post(
        {},
        {
          init: {
            credentials: "include",
          },
        },
      );
    },
    onSuccess: async (data) => {
      queryClient.setQueryData(["auth"], null);
    },
    onError: async (error) => {
      console.log(error);
    },
  });
}
