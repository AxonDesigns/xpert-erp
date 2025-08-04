import { useIsMobile } from "@frontend/hooks/use-mobile";
import { useSidebar } from "@frontend/hooks/use-sidebar";
import { cn } from "@frontend/lib/utils";
import { useGSAP } from "@gsap/react";
import * as Dialog from "@radix-ui/react-dialog";
import { rubberBand } from "@repo/utils";
import Draggable from "gsap/Draggable";
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useMemo,
  useRef,
} from "react";

export interface SidebarProps {
  open?: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
  className?: string;
  children?: ReactNode;
}

export function Sidebar({
  open,
  onOpenChange,
  className,
  children,
}: SidebarProps) {
  const { isOpen: _isOpen, setIsOpen: _setIsOpen } = useSidebar();
  const isOpen = useMemo(() => open || _isOpen, [_isOpen, open]);
  const lastPosition = useRef(0);
  const startOffset = useRef(0);
  const isMobile = useIsMobile({
    onChange: (isMobile) => {
      if (isMobile) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    },
  });

  const setIsOpen = (value: boolean) => {
    _setIsOpen(value);
    onOpenChange?.(value);
  };
  const scope = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      let draggables: Draggable[] = [];
      setTimeout(() => {
        const dialog = document.querySelector(
          ".mobile-sidebar-content",
        ) as HTMLDivElement | null;

        if (!dialog) return;

        const proxy = document.createElement("div");
        const width = dialog.clientWidth;
        draggables = Draggable.create(proxy, {
          type: "x",
          trigger: dialog,
          activeCursor: "default",
          cursor: "default",
          onDrag: (e) => {
            let current = e.clientX - startOffset.current;

            if (current > 0) {
              current = rubberBand(current, 20);
            }

            dialog.style.transform = `translateX(${current}px)`;

            lastPosition.current = current;
          },
          onDragStart: (e) => {
            startOffset.current = e.clientX;
            lastPosition.current = 0.0;
            dialog.style.transitionDuration = "0s";
          },
          onDragEnd: (e) => {
            const overDrag = lastPosition.current > 0;
            if (overDrag) {
              dialog.style.transitionDuration = "0.4s";
            } else {
              dialog.style.transitionDuration = "0.2s";
            }

            const delta =
              lastPosition.current - (e.clientX - startOffset.current);
            const factor = 1 - (startOffset.current - e.clientX) / width;
            if (delta > 8 || factor < 0.45) {
              setIsOpen(false);
              dialog.style.transform = `translateX(-${width}px)`;
            } else {
              dialog.style.transform = `translateX(0)`;
            }
          },
        });
      }, 1);

      return () => {
        for (const draggable of draggables) {
          draggable.kill();
        }
      };
    },
    {
      dependencies: [isOpen, isMobile],
    },
  );

  const content = (
    <div className="w-full h-full bg-surface-1 shadow-2xl rounded-lg flex flex-col">
      {children}
    </div>
  );

  return (
    <div ref={scope}>
      <div
        data-state={isOpen && !isMobile}
        className="w-[300px] data-[state=false]:w-0 transition-all duration-300"
      />
      <aside
        data-state={isOpen && !isMobile}
        className={cn(
          "box-border absolute z-50 left-0 top-0 bottom-0 w-[300px] data-[state=false]:-translate-x-[300px] transition-transform duration-300",
          "py-2 pl-2",
          className,
        )}
      >
        {content}
      </aside>

      <Dialog.Root open={isMobile && isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 fixed inset-0 transition-all duration-200 z-50" />
          <Dialog.Content className="mobile-sidebar-content cursor-none w-[300px] top-0 bottom-0 left-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-left-full data-[state=closed]:slide-out-to-left-full fixed inset-0 transition-all duration-300 grid grid-cols-1 z-50">
            <div className="py-2 pl-2">
              <Dialog.Title className="hidden">Sidebar</Dialog.Title>
              <Dialog.Description className="hidden">
                Sidebar
              </Dialog.Description>
              {content}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

export interface SidebarSectionProps {
  children: ReactNode;
  className?: string;
}

export function SidebarHeader({ children, className }: SidebarSectionProps) {
  return <div className={cn("px-2 pt-2", className)}>{children}</div>;
}

export function SidebarContent({ children, className }: SidebarSectionProps) {
  return (
    <div className={cn("flex-1 overflow-y-auto px-2 pt-2 pb-2", className)}>
      {children}
    </div>
  );
}

export function SidebarFooter({ children, className }: SidebarSectionProps) {
  return <div className={cn("px-2 pb-2", className)}>{children}</div>;
}

export function SidebarLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex p-2 pl-0 gap-2 h-dvh overflow-hidden">
      {children}
    </div>
  );
}
