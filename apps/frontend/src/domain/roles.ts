import { api } from "@frontend/lib/api";
import type { SelectRole } from "@repo/backend/types/roles";

type GetRolesResponse = {
  status: "success";
  data: SelectRole[];
} | {
  status: "error";
  error: string;
};

export async function getRoles(): Promise<GetRolesResponse> {
  const res = await api.roles.$get({},
    { init: { credentials: "include", }, },
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
