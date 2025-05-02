import { Button } from "@frontend/components/ui/button";
import { Slot } from "@radix-ui/react-slot";
import { ChevronDown } from "lucide-react";
import { type ComponentProps, createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@frontend/lib/utils";

type SidebarSectionContextType = {
  open: boolean,
  setOpen: (open: boolean) => void,
  startOpen?: boolean,
}

const SidebarSectionContext = createContext<SidebarSectionContextType>({
  open: false,
  setOpen: () => { },
  startOpen: false,
})

function useSidebarSection() {
  const context = useContext(SidebarSectionContext);
  if (!context) {
    throw new Error("useSidebarSection must be used within a SidebarSectionContextProvider");
  }
  return context;
}

export function SidebarSection({ children, startOpen = false }: { children: ReactNode, startOpen?: boolean }) {
  const [open, setOpen] = useState(startOpen);

  return (
    <SidebarSectionContext.Provider value={{ open, setOpen, startOpen }}>
      <div className="flex flex-col gap-1">
        {children}
        <div className="h-px bg-foreground/10" />
      </div>
    </SidebarSectionContext.Provider>
  )
}

export const SidebarSectionTrigger = ({ asChild, children, className, ...props }: ComponentProps<"button"> & { asChild?: boolean }) => {
  const { open, setOpen } = useSidebarSection();

  const Comp = asChild ? Slot : Button;

  return (
    <Comp
      className={cn('justify-start text-xs', className)}
      variant="text"
      onClick={() => setOpen(!open)}
      {...props}
    >
      <ChevronDown className={`${open ? "rotate-180" : ""} transition-transform duration-[0.3s] ease-[cubic-bezier(0.4, 0, 0.2, 1)]`} />
      {children}
    </Comp>
  )
}

export const SidebarSectionContent = ({ children }: { children: ReactNode }) => {
  const { open } = useSidebarSection();

  // Used to prevent the animation from starting before options report they are selected on mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => setMounted(true), 1);
  }, []);

  return (
    <motion.div
      initial={{ opacity: open ? 1 : 0, height: open ? "auto" : 0 }}
      animate={{
        opacity: open ? 1 : 0,
        height: open ? "auto" : 0,
        filter: open ? "blur(0)" : "blur(5px)",
      }}
      transition={{
        type: "tween",
        ease: [0.4, 0, 0.3, 1.0],
        duration: mounted ? 0.3 : 0,
      }}
      data-state={open ? "open" : "closed"}
      className='flex flex-col gap-1 overflow-hidden'
    >
      {children}
    </motion.div>
  )
}

export const SidebarSectionOption = ({ asChild, selected, className, ...props }: ComponentProps<"button"> & { asChild?: boolean, selected?: boolean }) => {
  const Comp = asChild ? Slot : Button;
  const { setOpen } = useSidebarSection();

  // Open section when option is selected
  useEffect(() => {
    if (selected) {
      setOpen(true);
    }
  }, [selected, setOpen]);

  return (
    <Comp
      className={cn(
        'group text-sm justify-start bg-white/0 ',
        'text-foreground hover:bg-foreground/10',
        "data-[state=selected]:bg-foreground/20 data-[state=selected]:text-foreground data-[state=selected]:hover:bg-foreground/30",
        className
      )}
      data-state={selected ? "selected" : "unselected"}
      {...props}
    />
  )
}