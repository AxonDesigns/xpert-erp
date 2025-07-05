import { api } from "@frontend/lib/api";
import type { SelectRole } from "@repo/backend/types/roles";
import type { ToDiscriminatedUnion } from "@repo/utils";

type GetRolesResponse = ToDiscriminatedUnion<
  {
    success: {
      data: SelectRole[];
    };
    error: {
      error: string;
    };
  },
  "status"
>;

export async function getRoles(query: {
  sort?: string | undefined;
  filter?: string | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}): Promise<GetRolesResponse> {
  const res = await api.roles.$get(
    { query },
    { init: { credentials: "include" } },
  );
  if (res.status !== 200) {
    return {
      status: "error",
      error: "Error: Failed to fetch roles",
    };
  }

  const roles = (await res.json()).map(
    (e) =>
      ({
        id: e.id,
        name: e.name,
        description: e.description,
        createdAt: new Date(e.createdAt),
        updatedAt: new Date(e.updatedAt),
      }) satisfies SelectRole,
  );

  return {
    status: "success",
    data: roles,
  };
}
