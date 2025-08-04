import { cn } from "@frontend/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type ComponentProps, useImperativeHandle, useRef } from "react";
import { TableCell, TableRow } from "./ui/table";

interface ExpandableRowProps extends ComponentProps<"tr"> {
  expanded: boolean;
  children?: React.ReactNode;
  colSpan?: number;
}

export function ExpandableRow({
  expanded = false,
  children,
  colSpan,
  className,
  ref: forwardedRef,
  ...props
}: ExpandableRowProps) {
  const ref = useRef<HTMLTableRowElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLTableRowElement);
  useGSAP(
    () => {
      const row = ref.current;
      const content = contentRef.current;
      if (!row || !content) return;

      if (expanded) {
        row.style.display = "";
        row.style.borderBottomColor = "";
      }

      let borderRemoved = false;

      gsap.killTweensOf(content);
      gsap.to(content, {
        height: expanded ? "auto" : "0px",
        opacity: expanded ? 1 : 0,
        ease: "power2.inOut",
        duration: 0.2,
        onUpdate: () => {
          if (row.clientHeight <= 3 && !expanded && !borderRemoved) {
            row.style.borderBottomColor = "transparent";
            borderRemoved = true;
          }

          if (row.clientHeight > 4 && expanded && borderRemoved) {
            row.style.borderBottomColor = "";
            borderRemoved = false;
          }
        },
        onComplete: () => {
          if (expanded && borderRemoved) {
            row.style.borderBottomColor = "";
          }

          if (!expanded) {
            if (!borderRemoved) {
              row.style.borderBottomColor = "transparent";
              borderRemoved = true;
            }
            row.style.display = "none";
          }
        },
      });
    },
    {
      scope: ref,
      dependencies: [expanded],
    },
  );

  return (
    <TableRow
      data-expanded={expanded}
      ref={ref}
      className={cn(
        "hover:bg-transparent overflow-hidden leading-none",
        className,
      )}
      {...props}
    >
      <TableCell
        colSpan={colSpan}
        className="p-0"
        style={{ borderBottomColor: "transparent" }}
      >
        <div
          className="overflow-hidden"
          ref={contentRef}
          style={{ height: "0" }}
        >
          {children}
        </div>
      </TableCell>
    </TableRow>
  );
}
