import type { PublicUser } from "@backend/db/types/users";
import { api } from "@frontend/lib/api";
import type { ToDiscriminatedUnion } from "@repo/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type LoginResult = ToDiscriminatedUnion<
  {
    success: {
      user: PublicUser;
    };
    error: {
      message: string;
    };
  },
  "status"
>;

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: async ({
      email,
      password,
    }: { email: string; password: string }): Promise<LoginResult> => {
      const res = await api.auth.login.$post(
        {
          json: {
            email,
            password,
          },
        },
        {
          init: {
            credentials: "include",
          },
        },
      );

      if (res.status === 200) {
        const data = await res.json();
        const user = {
          id: data.id,
          email: data.email,
          username: data.username,
          roleId: data.roleId,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
        } satisfies PublicUser;
        return {
          status: "success",
          user,
        };
      }

      if (res.status === 404) {
        const error = await res.json();
        return {
          status: "error",
          message: error.message,
        };
      }

      if (res.status === 422) {
        const error = await res.json();
        return {
          status: "error",
          message: error.error.issues.join(", "),
        };
      }

      if (res.status === 401) {
        const error = await res.json();
        return {
          status: "error",
          message: error.message,
        };
      }

      return {
        status: "error",
        message: "Unknown error",
      };
    },
    onSuccess: async (data) => {
      if (data.status === "success") {
        queryClient.setQueryData(["auth"], data);
      }
    },
    onError: async (error) => {
      console.error(error);
    },
  });
}
