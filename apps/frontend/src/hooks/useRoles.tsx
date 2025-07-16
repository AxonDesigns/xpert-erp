import { getRoles } from "@frontend/domain/roles";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useRoles = ({
  filterColumn,
  filter,
  page,
  limit,
}: {
  filterColumn?: string;
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

  const { data: roles, status } = useQuery({
    queryKey: ["roles", { filter: delayedFilter, filterColumn, page, limit }] as const,
    queryFn: async ({ queryKey: [, { filter, filterColumn, page, limit }] }) => {
      const reponse = await getRoles({
        page, limit, filter: `${filterColumn}:${filter}`, sort: "updatedAt:desc,createdAt:desc",
      });

      if (reponse.status === "success") {
        return reponse.data;
      }

      return [];
    }
  });

  return {
    roles: roles || [],
    status
  };
};