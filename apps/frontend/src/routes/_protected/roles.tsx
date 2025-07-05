import { DataTable } from "@frontend/components/data-table";
import { columns } from "@frontend/data-tables/roles";
import { createFileRoute } from "@tanstack/react-router";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { useRoles } from "@frontend/hooks/useRoles";
import { Input } from "@frontend/components/ui/input";
import { Button } from "@frontend/components/ui/button";
import { motion } from "motion/react";

export const Route = createFileRoute("/_protected/roles")({
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  wrapInSuspense: true,
});

function RouteComponent() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const [filter, setFilter] = useState<string>("");

  const roles = useRoles({
    filter,
    page: pagination.pageIndex,
    limit: pagination.pageSize,
  })

  const table = useReactTable({
    columns,
    data: roles,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    defaultColumn: {
      minSize: undefined,
      size: undefined,
      maxSize: undefined,
    },
    state: {
      pagination,
    }
  });

  const hasSelectedRows = table.getIsSomeRowsSelected() || table.getIsAllRowsSelected();

  return (
    <main className="flex flex-col bg-surface-1 animate-page-in flex-1 rounded-lg p-2 pt-8 gap-2">
      <h1 className="text-4xl font-bold ml-4">Roles</h1>
      <h2 className="ml-4">Manage your roles</h2>
      <div className="flex items-center">
        <Input value={filter} onChange={(e) => setFilter(e.target.value)} />
        <motion.div
          initial={{
            opacity: 0,
            width: "0",
          }}
          animate={{
            opacity: hasSelectedRows ? 1 : 0,
            width: hasSelectedRows ? "auto" : "0",
            marginLeft: hasSelectedRows ? "0.5rem" : "0",
            transition: {
              duration: 0.2,
              ease: "easeInOut",
            },
          }}
          exit={{
            opacity: 0,
            width: "0",
          }}>
          <Button
            variant="default"
            onClick={() => setFilter("")}
          >Actions</Button>
        </motion.div>
      </div>
      <DataTable table={table} />
    </main >
  );
}

function LoadingComponent() {
  return (
    <main className="flex flex-col bg-surface-1 animate-page-in flex-1 rounded-lg p-2 pt-8 gap-2 justify-center items-center">
      <h1>Loading...</h1>
    </main>
  )
}
