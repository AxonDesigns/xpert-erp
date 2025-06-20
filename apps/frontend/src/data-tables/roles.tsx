import type { SelectRole } from "@backend/db/types/roles";
import { format } from "@formkit/tempo";
import { Button, type buttonVariants } from "@frontend/components/ui/button";
import { Checkbox } from "@frontend/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@frontend/components/ui/popover";
import { Separator } from "@frontend/components/ui/separator";
import { PopoverClose } from "@radix-ui/react-popover";
import { createColumnHelper } from "@tanstack/react-table";
import type { VariantProps } from "class-variance-authority";
import { type LucideIcon, MoreVertical, Pencil, Trash } from "lucide-react";

const { accessor, display } = createColumnHelper<SelectRole>();

export const options: {
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

export const columns = [
  display({
    id: "select",
    header: (info) => (
      <div className="h-full w-full grid place-items-center">
        <Checkbox
          checked={info.table.getIsAllRowsSelected() || (info.table.getIsSomeRowsSelected() ? "indeterminate" : false)}
          onCheckedChange={() => {
            info.table.toggleAllRowsSelected();
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      </div>
    ),
    cell: (info) => (
      <div
        className="h-full w-full grid place-items-center"
        onKeyDown={() => { }}
      >
        <Checkbox
          checked={info.row.getIsSelected()}
          onCheckedChange={() => {
            info.row.toggleSelected();
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      </div>
    ),
    meta: {
      head: {
        className: "w-[0.01%] px-6",
      },
      cell: {
        className: "w-[0.01%] px-6",
      },
    },
  }),
  accessor("id", {
    header: () => <span>ID</span>,
    cell: (info) => <span>{info.getValue()}</span>,
    meta: {
      head: {
        className: "text-center w-[0.1%] px-6",
      },
      cell: {
        className: "text-center w-[0.1%] px-6",
      },
    },
  }),
  accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
    meta: {
      head: {
        className: "w-[0.01%] pr-6",
      },
      cell: {
        className: "w-[0.01%] pr-6",
      }
    }
  }),
  accessor("description", {
    header: "Description",
    cell: (info) => info.getValue(),
  }),
  accessor("createdAt", {
    header: "Created At",
    cell: (info) => format(info.getValue(), { date: "long", time: "short" }),
    meta: {
      head: {
        className: "w-[0.01%]",
      },
      cell: {
        className: "w-[0.01%]",
      }
    }
  }),
  accessor("updatedAt", {
    header: "Updated At",
    cell: (info) => format(info.getValue(), { date: "long", time: "short" }),
    meta: {
      head: {
        className: "w-[0.01%]",
      },
      cell: {
        className: "w-[0.01%]",
      }
    }
  }),
  display({
    id: "actions",
    header: () => <span>Actions</span>,
    cell: (info) => {
      return (
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
                          action(info.row.original);
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
      );
    },
    meta: {
      head: {
        className: "w-[0.01%] px-6 text-center",
      },
      cell: {
        className: "w-[0.01%] px-6 text-center",
      },
    }
  })
];
