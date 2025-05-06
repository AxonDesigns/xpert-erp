import { Button } from "@frontend/components/ui/button";
import { Slot } from "@radix-ui/react-slot";
import { ChevronDown } from "lucide-react";
import { type ComponentProps, createContext, type ReactNode, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@frontend/lib/utils";

type SectionContextType = {
  open: boolean,
  setOpen: (open: boolean) => void,
  startOpen?: boolean,
}

const SectionContext = createContext<SectionContextType>({
  open: false,
  setOpen: () => { },
  startOpen: false,
})

function useSection() {
  const context = useContext(SectionContext);
  if (!context) {
    throw new Error("useSidebarSection must be used within a SidebarSectionContextProvider");
  }
  return context;
}

export function Section({ children, startOpen = false }: { children: ReactNode, startOpen?: boolean }) {
  const [open, setOpen] = useState(startOpen);

  return (
    <SectionContext.Provider value={{ open, setOpen, startOpen }}>
      <div className="flex flex-col gap-1">
        {children}
        <div className="h-px bg-foreground/10" />
      </div>
    </SectionContext.Provider>
  )
}

export const SectionTrigger = ({ asChild, children, className, ...props }: ComponentProps<"button"> & { asChild?: boolean }) => {
  const { open, setOpen } = useSection();

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

export const SectionContent = ({ children }: { children: ReactNode }) => {
  const { open } = useSection();

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
        filter: open ? "blur(0)" : "blur(3px)",
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

export const SectionOption = ({ asChild, selected, className, ref: refProp, ...props }: ComponentProps<"button"> & { asChild?: boolean, selected?: boolean }) => {
  const Comp = asChild ? Slot : Button;
  const ref = useRef<HTMLButtonElement>(null);
  useImperativeHandle(refProp, () => ref.current as HTMLButtonElement);
  const { setOpen } = useSection();

  // Open section when option is selected
  useEffect(() => {
    if ((ref.current && ref.current.getAttribute("data-status") === "active") || selected) {
      setOpen(true);
    }
  }, [setOpen, selected]);

  return (
    <Comp
      className={cn(
        "flex gap-2 items-center p-2 text-sm [&_svg:not([class*='size-'])]:size-4",
        'group text-sm justify-start bg-white/0 ',
        'text-foreground hover:bg-foreground/10 shadow-none',
        "data-[status=active]:bg-foreground data-[status=active]:text-background data-[status=active]:hover:bg-foreground/90",
        "data-[status=active]:shadow-md",
        "rounded-md transition-colors duration-100 hover:duration-0",
        className
      )}
      //data-state={selected ? "selected" : "unselected"}
      ref={ref}
      {...props}
    />
  )
}