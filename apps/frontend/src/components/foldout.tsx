import { cn } from "@frontend/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ButtonProps } from "./ui/button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

type FoldoutGroupContextType = {
  openedFoldouts: string[];
  requestOpen(value: string, open?: boolean): void;
  multiple: boolean;
};

export const FoldoutGroupContext = createContext<FoldoutGroupContextType>({
  openedFoldouts: [],
  requestOpen: () => {},
  multiple: false,
});

export function FoldoutGroup({
  children,
  multiple = false,
}: {
  children: ReactNode;
  /**
   * Whether multiple foldouts can be open at the same time
   */
  multiple?: boolean;
}) {
  const [openedFoldouts, setOpenedFoldouts] = useState<string[]>([]);

  const requestOpen = (value: string, open?: boolean) => {
    if (open === undefined) {
      if (openedFoldouts.includes(value)) {
        setOpenedFoldouts(openedFoldouts.filter((v) => v !== value));
      } else {
        if (multiple) {
          setOpenedFoldouts([...openedFoldouts, value]);
        } else {
          setOpenedFoldouts([value]);
        }
      }
    } else {
      if (open && openedFoldouts.includes(value)) return;
      if (!open && !openedFoldouts.includes(value)) return;
      if (multiple) {
        setOpenedFoldouts(
          open
            ? [...openedFoldouts, value]
            : openedFoldouts.filter((v) => v !== value),
        );
      } else {
        setOpenedFoldouts(open ? [value] : []);
      }
    }
  };

  return (
    <FoldoutGroupContext.Provider
      value={{ openedFoldouts, requestOpen, multiple }}
    >
      {children}
    </FoldoutGroupContext.Provider>
  );
}

export function useFoldoutGroupContext() {
  const context = useContext(FoldoutGroupContext);
  if (context === undefined) {
    return {
      available: false,
    } as const;
  }

  return {
    available: true,
    context,
  } as const;
}

type FoldoutContextType = {
  isOpen: boolean;
  toggle: (open?: boolean) => void;
};

export const FoldoutContext = createContext<FoldoutContextType>({
  isOpen: false,
  toggle: () => {},
});

export function Foldout({
  children,
  value,
  startOpen = false,
}: {
  children: ReactNode;
  value: string;
  startOpen?: boolean;
}) {
  const { available, context } = useFoldoutGroupContext();
  const [_isOpen, setIsOpen] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: should execute only on mount
  useEffect(() => {
    if (startOpen) {
      if (available) {
        context.requestOpen(value, true);
      } else {
        setIsOpen(true);
      }
    }
  }, []);

  const isOpen = useMemo(() => {
    if (!available) return _isOpen;
    return context.openedFoldouts.includes(value);
  }, [context, value, available, _isOpen]);

  const toggle = useCallback(
    (open?: boolean) => {
      if (available) {
        context.requestOpen(value, open);
      } else {
        setIsOpen(open ?? !isOpen);
      }
    },
    [value, context, isOpen, available],
  );

  return (
    <FoldoutContext.Provider value={{ isOpen, toggle }}>
      <div className="flex flex-col items-stretch justify-stretch">
        {children}
      </div>
    </FoldoutContext.Provider>
  );
}

export function useFoldoutContext() {
  const context = useContext(FoldoutContext);
  if (context === undefined) {
    throw new Error("useFoldoutContext must be used within a FoldoutProvider");
  }
  return context;
}

export function FoldoutTrigger({
  children,
  className,
  variant,
  size,
  onClick,
  asChild,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  const { isOpen, toggle } = useFoldoutContext();

  return (
    <Comp
      className={cn(
        "group flex justify-start bg-foreground/5 hover:bg-foreground/10 transition-colors duration-100 rounded-md py-1.5 px-2",
        className,
      )}
      data-slot="foldout-trigger"
      aria-expanded={isOpen}
      onClick={(e) => {
        toggle();
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function FoldoutContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { isOpen } = useFoldoutContext();
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const content = ref.current;
      if (!content) return;
      gsap.killTweensOf(content);
      gsap.to(content, {
        duration: 0.2,
        ease: "power3.out",
        height: isOpen ? "auto" : 0,
        opacity: isOpen ? 1 : 0,
        scale: isOpen ? 1 : 0.95,
        filter: isOpen ? "blur(0px)" : "blur(5px)",
      });
    },
    {
      scope: ref,
      dependencies: [isOpen],
    },
  );

  return (
    <div
      className={cn(
        "group flex flex-col aria-hidden:pointer-events-none gap-0",
      )}
      data-slot="foldout-content"
      aria-hidden={!isOpen}
    >
      <div ref={ref} className="overflow-hidden mt-2">
        <div
          className={cn(
            "mb-2 pl-2 flex flex-col gap-2 items-stretch",
            className,
          )}
        >
          {children}
        </div>
      </div>
      <div className="h-px bg-border" />
    </div>
  );
}

export function FoldoutToggle({
  children,
  onClick,
  asChild,
  className,
  variant,
  size,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  const { toggle } = useFoldoutContext();

  return (
    <Comp
      data-slot="foldout-toggle"
      className={cn("group", className)}
      onClick={(e) => {
        toggle();
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </Comp>
  );
}
