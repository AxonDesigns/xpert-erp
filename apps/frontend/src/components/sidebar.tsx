import { useIsMobile } from "@frontend/hooks/use-mobile";
import { useSidebar } from "@frontend/hooks/useSidebar";
import { cn } from "@frontend/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";
import { type ReactNode, useCallback, useMemo, type Dispatch, type SetStateAction, useState, useEffect } from "react";

export interface SidebarProps {
  open?: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
  className?: string;
  children?: ReactNode;
}

export function Sidebar({ open, onOpenChange, className, children }: SidebarProps) {
  const { isOpen: _isOpen, setIsOpen: _setIsOpen } = useSidebar();

  const isOpen = useMemo(() => open || _isOpen, [_isOpen, open]);
  const isMobile = useIsMobile();
  const [isDesktopOpen, setIsDesktopOpen] = useState(_isOpen);

  const setIsOpen = useCallback((value: boolean) => {
    _setIsOpen(value);
    onOpenChange?.(value);
  }, [_setIsOpen, onOpenChange]);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }

    if (!isMobile && isDesktopOpen) {
      setIsOpen(true);
    }

  }, [isMobile, setIsOpen, isDesktopOpen]);

  useEffect(() => {
    if (!isMobile) {
      setIsDesktopOpen(isOpen);
    }

  }, [isOpen, isMobile]);

  const content = (
    <div className="w-full h-full bg-surface-1 rounded-lg flex flex-col">
      {children}
    </div>
  )

  return (
    <>
      <div
        data-state={isOpen && !isMobile}
        className="w-[300px] data-[state=false]:w-0 transition-all duration-300"
      />
      <aside
        data-state={isOpen && !isMobile}
        className={cn(
          "box-border absolute z-50 left-0 top-0 bottom-0 w-[300px] data-[state=false]:-translate-x-[300px] transition-transform duration-300",
          "py-2 pl-2",
          className
        )}
      >
        {content}
      </aside>

      <Dialog.Root open={isMobile && isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 fixed inset-0 transition-all duration-300 z-50" />
          <Dialog.Content
            className="w-[300px] top-0 bottom-0 left-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-left-full data-[state=closed]:slide-out-to-left-full fixed inset-0 transition-all duration-300 grid grid-cols-1 z-50">
            <div className="py-2 pl-2">
              <Dialog.Title className="hidden" >Sidebar</Dialog.Title>
              <Dialog.Description className="hidden">Sidebar</Dialog.Description>
              {content}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

export interface SidebarSectionProps {
  children: ReactNode;
  className?: string;
}

export function SidebarHeader({ children, className }: SidebarSectionProps) {
  return (
    <div className={cn("px-2 pt-2", className)}>
      {children}
    </div>
  );
}

export function SidebarContent({ children, className }: SidebarSectionProps) {
  return (
    <div className={cn("flex-1 overflow-y-auto px-2 pt-2 pb-2", className)}>
      {children}
    </div>
  );
}

export function SidebarFooter({ children, className }: SidebarSectionProps) {
  return (
    <div className={cn("px-2 pb-2", className)}>
      {children}
    </div>
  );
}