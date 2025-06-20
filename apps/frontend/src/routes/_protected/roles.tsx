import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@frontend/components/ui/table";
import { columns } from "@frontend/data-tables/roles";
import { getRoles as getRolesApi } from "@frontend/domain/roles";
import { cn } from "@frontend/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

async function getRoles() {
  const reponse = await getRolesApi();
  if (reponse.status === "success") {
    return reponse.data;
  }

  return [];
}

export const Route = createFileRoute("/_protected/roles")({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.prefetchQuery({
      queryKey: ["roles"],
      queryFn: getRoles,
    })
  }
});

function RouteComponent() {
  const { data: roles } = useSuspenseQuery({ queryKey: ["roles"], queryFn: getRoles });

  const table = useReactTable({
    columns,
    data: roles,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      minSize: undefined,
      size: undefined,
      maxSize: undefined,
    }
  });

  return (
    <main className="flex flex-col bg-surface-1 animate-page-in flex-1 rounded-lg p-2 pt-8 gap-2">
      <h1 className="text-4xl font-bold ml-4">Roles</h1>
      <h2 className="ml-4">Manage your roles</h2>
      <div className="flex flex-col flex-1 overflow-hidden border border-input rounded-xl rounded-b-md mt-6">
        <Table className="flex-1 border-b border-input">
          <TableHeader className="bg-foreground/5">
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn("", header.column.columnDef.meta?.head?.className)}
                    onClick={(e) => {
                      header.column.columnDef.meta?.head?.onClick?.(e, header.getContext());
                    }}
                    style={{
                      minWidth: header.column.columnDef.minSize,
                      width: header.column.columnDef.size,
                      maxWidth: header.column.columnDef.maxSize,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => {
                  row.toggleSelected();
                }}
                className="cursor-pointer hover:duration-0"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn("", cell.column.columnDef.meta?.cell?.className)}
                    onClick={(e) => {
                      cell.column.columnDef.meta?.cell?.onClick?.(e, cell.getContext());
                    }}
                    style={{
                      minWidth: cell.column.columnDef.minSize || undefined,
                      width: cell.column.columnDef.size || undefined,
                      maxWidth: cell.column.columnDef.maxSize || undefined,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
