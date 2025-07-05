import { getRoles } from "@frontend/domain/roles";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useRoles = ({
  filter,
  page,
  limit,
}: {
  filter?: string;
  page?: number;
  limit?: number;
}) => {
  const [delayedFilter, setDelayedFilter] = useState<string | undefined>();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayedFilter(filter);
    }, 300);

    return () => clearTimeout(timer);
  }, [filter]);

  const { data: roles } = useQuery({
    queryKey: ["roles", { filter: delayedFilter, page, limit }] as const,
    queryFn: async ({ queryKey: [, { filter, page, limit }] }) => {
      const reponse = await getRoles({
        page, limit, filter: `name:${filter},description:${filter}`, sort: "updatedAt:desc,createdAt:desc",
      });

      if (reponse.status === "success") {
        return reponse.data;
      }

      return [];
    }
  });

  return roles || [];
};