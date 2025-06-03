import { useImperativeHandle, useRef, type ComponentProps } from "react";
import { cn } from "@frontend/lib/utils";
import type { LucideIcon } from "lucide-react";

interface LabeledInputProps extends ComponentProps<"input"> {
  label: string;
  icon?: LucideIcon;
}

export function LabeledInput({
  className,
  ref: forwardedRef,
  label,
  icon,
  ...props
}: LabeledInputProps) {
  const ref = useRef<HTMLInputElement>(null);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLInputElement);

  const StartIcon = icon;

  return (
    <div
      className={cn(
        "relative grid col-span-1 bg-foreground/2 cursor-text border border-foreground/25 rounded-md",
        "focus-within:border-foreground/50 focus-within:ring-3 ring-foreground/25",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/25",
        "aria-[errormessage]:border-destructive aria-[errormessage]:ring-destructive/25",
        "transition-all",
      )}
      aria-invalid={props["aria-invalid"]}
      aria-errormessage={props["aria-errormessage"]}
      onClick={() => {
        //e.preventDefault();
        //e.stopPropagation();
        ref.current?.focus();
      }}
      onKeyDown={() => {
        //e.preventDefault();
        //e.stopPropagation();
        ref.current?.focus();
      }}
    >
      <div className="grid grid-cols-[auto_auto_1fr] px-2.5 pt-1.5 gap-1 items-center pointer-events-none">
        {StartIcon && (
          <StartIcon
            aria-invalid={props["aria-invalid"]}
            aria-errormessage={props["aria-errormessage"]}
            className="size-3.5 text-foreground/50 select-none aria-invalid:text-destructive aria-[errormessage]:text-destructive"
          />
        )}
        <label
          htmlFor={props.id}
          aria-invalid={props["aria-invalid"]}
          aria-errormessage={props["aria-errormessage"]}
          className={cn(
            "text-foreground/50 text-xs font-semibold pointer-events-none select-none",
            props.required ? "after:content-['*']" : "",
            "after:text-destructive after:ml-1  aria-invalid:text-destructive aria-[errormessage]:text-destructive",
          )}
        >
          {label}
        </label>
        {props["aria-errormessage"] && (
          <span className="text-right text-xs text-destructive">
            {props["aria-errormessage"]}
          </span>
        )}
      </div>
      <input
        className={cn(
          "border-none bg-transparent outline-0 text-base md:text-sm ",
          "selection:bg-foreground selection:text-background placeholder:text-foreground/30 p-2.5 pt-1",
          className,
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
}
