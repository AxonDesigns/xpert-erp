import { DataTable } from "@frontend/components/data-table";
import { Button } from "@frontend/components/ui/button";
import { Input } from "@frontend/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@frontend/components/ui/select";
import { columns } from "@frontend/data-tables/roles";
import { useRoles } from "@frontend/hooks/use-roles";
import { getRowModel } from "@frontend/lib/row-model";
import { useGSAP } from "@gsap/react";
import { columns as roleColumns } from "@repo/backend/types/roles";
import { createFileRoute } from "@tanstack/react-router";
import {
  getExpandedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import gsap from "gsap";
import { Download, Trash } from "lucide-react";
import { useRef, useState } from "react";

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
  const [filterColumn, setFilterColumn] = useState<string>(
    roleColumns.find((column) => column.default)?.id || "",
  );

  const { roles, status } = useRoles({
    filterColumn,
    filter,
    page: pagination.pageIndex,
    limit: pagination.pageSize,
  });

  const table = useReactTable({
    columns,
    data: roles,
    getCoreRowModel: getRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onPaginationChange: setPagination,
    getRowCanExpand: () => true,
    manualPagination: true,
    defaultColumn: {
      minSize: undefined,
      size: undefined,
      maxSize: undefined,
    },
    state: {
      pagination,
    },
  });

  const hasSelectedRows =
    table.getIsSomeRowsSelected() || table.getIsAllRowsSelected();

  const container = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const batchActions = document.querySelector(".batch-actions");
      if (!batchActions) return;

      gsap.killTweensOf(batchActions);
      gsap.to(batchActions, {
        duration: 0.3,
        width: hasSelectedRows ? "auto" : "0",
        opacity: hasSelectedRows ? 1 : 0,
        ease: "power3.out",
      });
    },
    {
      scope: container,
      dependencies: [hasSelectedRows],
    },
  );

  return (
    <main
      className="flex flex-col bg-surface-1 animate-page-in flex-1 rounded-lg p-2 pt-8 gap-2"
      ref={container}
    >
      <h1 className="text-4xl font-bold ml-4">Roles</h1>
      <h2 className="ml-4">Manage your roles</h2>
      <div className="flex items-center">
        <Input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter..."
        />
        <Select
          value={filterColumn}
          onValueChange={(value) => setFilterColumn(value)}
        >
          <SelectTrigger className="ml-2 w-60 ">
            <SelectValue placeholder="Select an action" />
          </SelectTrigger>
          <SelectContent>
            {roleColumns.map((column) => {
              return (
                <SelectItem key={column.id} value={column.id}>
                  {column.label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <div className="batch-actions flex items-center gap-2">
          <Button
            variant="destructive"
            size="icon"
            onClick={() => {
              setFilter("");
              console.log(
                table.getSelectedRowModel().rows.map((row) => row.original),
              );
            }}
            className="ml-2"
          >
            <Trash />
          </Button>
          <Button variant="default" size="icon" onClick={() => setFilter("")}>
            <Download />
          </Button>
        </div>
      </div>
      <DataTable
        table={table}
        isLoading={status === "pending"}
        isEmpty={roles.length === 0}
        onRowClick={(row) => {
          row.toggleExpanded();
        }}
        expandedContent={(row) => (
          <div className="p-2">
            <h1>Expanded content for {row.original.name}</h1>
          </div>
        )}
      />
    </main>
  );
}

function LoadingComponent() {
  return (
    <main className="flex flex-col bg-surface-1 animate-page-in flex-1 rounded-lg p-2 pt-8 gap-2 justify-center items-center">
      <h1>Loading...</h1>
    </main>
  );
}
