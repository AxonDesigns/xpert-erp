import type * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"
import { cn } from "@frontend/lib/utils"
import {
  AnimatePresence,
  type AnimationControls,
  motion,
  type TargetAndTransition,
  type Transition,
  type VariantLabels,
} from 'motion/react';

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/0 data-[state=open]:backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  layoutId,
  transition = {
    type: "tween",
    ease: [0, 1.0, 0.3, 1.0],
    duration: 0.4,
  },
  initial = {
    filter: "blur(10px)",
  },
  animate = {
    filter: "blur(0px)",
  },
  exit = {
    filter: "blur(10px)",
  },
  initialContainer = { opacity: 1 },
  animateContainer = { opacity: 1 },
  exitContainer = { opacity: 0 },
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  layoutId?: string | undefined,
  transition?: Transition | undefined,
  initial?: boolean | TargetAndTransition | VariantLabels | undefined,
  animate?: boolean | TargetAndTransition | VariantLabels | AnimationControls | undefined,
  exit?: TargetAndTransition | VariantLabels | undefined,
  initialContainer?: boolean | TargetAndTransition | VariantLabels | undefined,
  animateContainer?: boolean | TargetAndTransition | VariantLabels | AnimationControls | undefined,
  exitContainer?: TargetAndTransition | VariantLabels | undefined,
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={className}
        {...props}
      >
        <AnimatePresence>
          <motion.div
            layoutId={layoutId}
            initial={initialContainer}
            animate={animateContainer}
            exit={exitContainer}
            className={cn(
              'z-50 fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-full max-w-lg',
              'bg-background rounded-lg border shadow-lg'
            )}
            transition={transition}
          >
            <motion.div
              initial={initial}
              animate={animate}
              exit={exit}
              transition={transition}
              className="relative w-full h-full p-6 flex flex-col gap-2"
            >
              {children}
              <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
                <XIcon />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
