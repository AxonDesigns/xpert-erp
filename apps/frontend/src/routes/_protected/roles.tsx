import type { SelectRole } from "@backend/db/types/roles";
import { Button, type buttonVariants } from "@frontend/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@frontend/components/ui/popover";
import { Separator } from "@frontend/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@frontend/components/ui/table";
import { columns } from "@frontend/data-tables/roles";
import { getRoles } from "@frontend/domain/roles";
import { PopoverClose } from "@radix-ui/react-popover";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { VariantProps } from "class-variance-authority";
import { type LucideIcon, MoreVertical, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_protected/roles")({
  component: RouteComponent,
});

const options: {
  icon: LucideIcon;
  label: string;
  variant: VariantProps<typeof buttonVariants>["variant"];
  action: (data: SelectRole) => void;
}[] = [
    {
      icon: Pencil,
      label: "Edit",
      variant: "ghost",
      action: (data) => {
        console.log(data);
      },
    },
    {
      icon: Trash,
      label: "Delete",
      variant: "destructive",
      action: (data) => {
        console.log(data);
      },
    },
  ];

function RouteComponent() {
  const { data } = useQuery({ queryKey: ["roles"], queryFn: getRoles });

  const table = useReactTable({
    columns,
    data: data?.status === "success" ? data.data : [],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <main className="flex flex-col bg-surface-1 animate-page-in flex-1 rounded-lg p-2 pt-8 gap-2">
      <h1 className="text-4xl font-bold ml-4">Roles</h1>
      <h2 className="ml-4">Manage your roles</h2>
      <div className="flex-1 overflow-hidden border border-input rounded-xl rounded-b-md mt-6">
        <Table className="border-b border-input">
          <TableHeader className="bg-foreground/5">
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </TableHead>
                ))}
                <TableHead className="text-center">
                  <span>Actions</span>
                </TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => {
                  toast.success(`Role ${row.original.name} has been selected`);
                }}
                className="cursor-pointer hover:duration-0"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                <TableCell className="text-center mx-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <MoreVertical />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="p-0 min-w-[200px] grid grid-cols-1 overflow-hidden"
                      side="right"
                      align="center"
                      asChild
                    >
                      <ul>
                        <h2 className="py-2 px-4 text-xs">Actions</h2>
                        <Separator />
                        {options.map(
                          ({ icon: Icon, label, variant, action }, index) => {
                            return (
                              <PopoverClose
                                // biome-ignore lint/suspicious/noArrayIndexKey:
                                key={index}
                                asChild
                              >
                                <Button
                                  variant={variant}
                                  className="rounded-none justify-start"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action(row.original);
                                  }}
                                >
                                  <Icon />
                                  {label}
                                </Button>
                              </PopoverClose>
                            );
                          },
                        )}
                      </ul>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
