import "@tanstack/react-table"; //or vue, svelte, solid, qwik, etc.
import type {
  CellContext,
  HeaderContext,
  RowData,
} from "@tanstack/react-table";
import type { ComponentProps } from "react";

type Meta = {
  className?: string;
};

type CellMeta<TData extends RowData, TValue> = Meta & {
  onClick?: (
    event: Parameters<NonNullable<ComponentProps<"td">["onClick"]>>[0],
    context: CellContext<TData, TValue>,
  ) => void;
};

type HeadMeta<TData extends RowData, TValue> = Meta & {
  onClick?: (
    event: Parameters<NonNullable<ComponentProps<"th">["onClick"]>>[0],
    context: HeaderContext<TData, TValue>,
  ) => void;
};

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    head?: HeadMeta<TData, TValue>;
    cell?: CellMeta<TData, TValue>;
  }
}
