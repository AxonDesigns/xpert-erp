import { cn } from "@frontend/lib/utils";
import { Button, type ButtonProps } from "./ui/button";
import { useCallback, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface HoldeableButtonProps extends Omit<ButtonProps, "onClick"> {
  holdFor?: number;
  onClick?: () => void;
  containerClassName?: string;
}

export function HoldeableButton({
  holdFor = 1.5,
  className,
  children,
  variant,
  onMouseDown,
  onMouseUp,
  onClick,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
  ...props
}: HoldeableButtonProps) {
  const [isHeld, setIsHeld] = useState(false);
  const containerRef = useRef<HTMLButtonElement>(null);

  const { contextSafe } = useGSAP({}, { scope: containerRef });

  const onComplete = contextSafe(() => {
    gsap.killTweensOf([".bar"]);
    gsap.fromTo(
      ".bar",
      {
        width: "100%",
        alpha: 1.0,
      },
      {
        width: "100%",
        alpha: 0.0,
        duration: 0.25,
        ease: "power1.inOut",
      },
    );

    gsap
      .timeline()
      .fromTo(
        ".button-content",
        {
          scale: 1.0,
        },
        {
          scale: 1.1,
          duration: 0.1,
          ease: "sine.out",
        },
      )
      .to(".button-content", {
        scale: 1.0,
        duration: 1,
        ease: "elastic.out",
      });
  });

  const stopHold = contextSafe(() => {
    gsap.killTweensOf([".bar", ".button-content"]);
    gsap.to(".bar", {
      width: "0%",
      duration: 0.15,
      ease: "power1.inOut",
    });
    gsap.to(".button-content", {
      scale: 1.0,
      duration: 0.75,
      ease: "elastic.out",
    });
  });

  const startHold = contextSafe(() => {
    gsap.killTweensOf([".bar", ".button-content"]);
    gsap.set(".bar", {
      width: "0%",
      alpha: 1.0,
    });

    gsap.to(".bar", {
      width: "100%",
      duration: holdFor,
      ease: "linear",
      onComplete: () => {
        setIsHeld(false);
        onComplete();
        onClick?.();
      },
    });
    gsap.to(".button-content", {
      scale: 0.9,
      duration: holdFor,
      ease: "linear",
    });
  });

  const onHeld = useCallback(() => {
    setIsHeld(true);
    startHold();
  }, [startHold]);

  const onRelease = useCallback(() => {
    if (!isHeld) return;
    stopHold();
    setIsHeld(false);
  }, [stopHold, isHeld]);

  return (
    <Button
      ref={containerRef}
      className={cn("button relative overflow-hidden select-none", className)}
      onMouseDown={(e) => {
        onHeld();
        onMouseDown?.(e);
      }}
      onMouseUp={(e) => {
        onRelease();
        onMouseUp?.(e);
      }}
      onMouseLeave={(e) => {
        onRelease();
        onMouseLeave?.(e);
      }}
      onTouchStart={(e) => {
        onHeld();
        onTouchStart?.(e);
      }}
      onTouchEnd={(e) => {
        onRelease();
        onTouchEnd?.(e);
      }}
      variant={variant}
      {...props}
    >
      <div
        className={cn(
          "bar absolute inset-0 pointer-events-none select-none",
          {
            default: "bg-background/25",
            destructive: "bg-background/50 dark:bg-destructive/25",
            destructiveLow: "bg-destructive/20",
            warning: "bg-yellow-700/25 dark:bg-yellow-500/25",
            outline: "bg-foreground/25",
            secondary: "bg-foreground/25",
            ghost: "bg-foreground/15",
            link: "bg-foreground/15",
            text: "bg-foreground/15",
            none: "",
          }[variant || "default"],
        )}
        style={{ width: 0 }}
      />
      <div className="button-content inline-flex items-center justify-center gap-2 whitespace-nowrap">
        {children}
      </div>
    </Button>
  );
}
