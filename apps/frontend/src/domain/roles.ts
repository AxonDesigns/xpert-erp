import { api } from "@frontend/lib/api";
import type { SelectRole } from "@repo/backend/types/roles";

export async function getRoles(): Promise<{
  data: SelectRole[] | null;
  error: Error | null;
}> {
  const res = await api.roles.$get(
    {},
    {
      init: {
        credentials: "include",
      },
    },
  );
  if (res.status !== 200) {
    return {
      data: null,
      error: new Error(""),
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
    data: roles,
    error: null,
  };
}
