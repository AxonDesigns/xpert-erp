import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@frontend/components/ui/table";
import { cn } from "@frontend/lib/utils";
import {
  flexRender,
  type Table as ReactTable,
  type Row,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Fragment, type JSX, type ComponentProps } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ExpandableRow } from "./expandable-row";

interface DataTableProps<TData>
  extends Omit<ComponentProps<"div">, "children"> {
  table: ReactTable<TData>;
  isLoading?: boolean;
  isEmpty?: boolean;
  onRowClick?: (row: Row<TData>) => void;
  expandedContent?: (row: Row<TData>) => JSX.Element;
}

export function DataTable<TData>({
  table,
  className,
  isLoading,
  isEmpty,
  onRowClick,
  expandedContent,
  ...props
}: DataTableProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex;
  //const pageSize = table.getState().pagination.pageSize;
  const totalPages = table.getPageCount();
  const totalEntries = table.getRowModel().rows.length;

  return (
    <div
      className={cn(
        "flex flex-col flex-1 justify-between border border-input rounded-xl rounded-b-md not-dark:bg-surface-3 overflow-hidden",
        className,
      )}
      {...props}
    >
      <Table className="flex-1 border-b border-input">
        <TableHeader className="bg-foreground/5">
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    "",
                    header.column.columnDef.meta?.head?.className,
                  )}
                  onClick={(e) => {
                    header.column.columnDef.meta?.head?.onClick?.(
                      e,
                      header.getContext(),
                    );
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
          {!isLoading &&
            !isEmpty &&
            table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <TableRow
                  onClick={() => {
                    onRowClick?.(row);
                  }}
                  data-selected={row.getIsSelected()}
                  className={cn(
                    "cursor-pointer hover:duration-0",
                    "data-[selected=true]:bg-foreground/5",
                    "data-[selected=true]:dark:bg-foreground/10",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "",
                        cell.column.columnDef.meta?.cell?.className,
                      )}
                      onClick={(e) => {
                        cell.column.columnDef.meta?.cell?.onClick?.(
                          e,
                          cell.getContext(),
                        );
                      }}
                      style={{
                        minWidth: cell.column.columnDef.minSize || undefined,
                        width: cell.column.columnDef.size || undefined,
                        maxWidth: cell.column.columnDef.maxSize || undefined,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                {
                  <ExpandableRow
                    colSpan={table.getAllColumns().length}
                    expanded={row.getIsExpanded()}
                  >
                    {expandedContent?.(row)}
                  </ExpandableRow>
                }
              </Fragment>
            ))}
        </TableBody>
      </Table>
      <div className="flex items-center p-2 border-t border-input text-sm">
        <span className="ml-2">
          Showing <b>{pageIndex + 1}</b> of <b>{totalPages}</b> pages with{" "}
          <b>{totalEntries}</b> entries
        </span>
        <div className="flex-1" />
        <Button
          size="sm"
          variant="ghost"
          className="w-8"
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeft />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft />
          Previous
        </Button>
        <Input
          className="w-8 h-8 p-0 text-center"
          value="0"
          disabled={totalPages === 1}
        />
        <Button size="sm" variant="ghost" disabled={!table.getCanNextPage()}>
          Next
          <ChevronRight />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="w-8"
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRight />
        </Button>
      </div>
    </div>
  );
}
