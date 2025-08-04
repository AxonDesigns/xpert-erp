import type { PublicUser } from "@backend/db/types/users";
import { api } from "@frontend/lib/api";
import type { ToDiscriminatedUnion } from "@repo/utils";
import { useQuery } from "@tanstack/react-query";

export type AuthQueryResult = ToDiscriminatedUnion<
	{
		success: {
			user: PublicUser;
		};
		error: {
			error: unknown;
		};
	},
	"status"
>;

export const useAuthQueryOptions = () => ({
	queryKey: ["auth"],
	queryFn: async (): Promise<AuthQueryResult> => {
		const res = await api.auth.me.$get(
			{},
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

		return {
			status: "error",
			error: await res.json(),
		};
	},
});

export function useAuthQuery() {
	return useQuery(useAuthQueryOptions());
}
