import type { SelectRole } from "@backend/db/types/roles";
import { format } from "@formkit/tempo";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<SelectRole>();

export const columns = [
  columnHelper.accessor("id", {
    header: () => <span className="mx-2">ID</span>,
    cell: (info) => <div className="text-center">{info.getValue()}</div>,
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("createdAt", {
    header: "Created At",
    cell: (info) => format(info.getValue(), "long"),
  }),
  columnHelper.accessor("updatedAt", {
    header: "Updated At",
    cell: (info) => format(info.getValue(), "long"),
  }),
];
