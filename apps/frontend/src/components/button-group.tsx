import { type ReactNode, useState } from "react"
import { Button } from "./ui/button"
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";

interface ButtonGroupProps {
  content?: ReactNode
  children?: ReactNode
}

const ButtonGroup = ({ children, content }: ButtonGroupProps) => {
  const [open, setOpen] = useState(false);
  return <div className="flex flex-col">
    <Button
      variant="outline"
      className='group border-none'
      data-open={open}
      onClick={() => setOpen(!open)}
    >
      <ChevronDown className='group-data-[open=true]:rotate-180 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]' />
      <div className="flex-1 flex gap-2 items-center justify-start">
        {content}
      </div>
    </Button>
    <motion.div
      data-open={open}
      className="flex overflow-hidden"
      transition={{
        type: "tween",
        duration: 0.25,
        ease: [0.2, 0.0, 0.2, 1.0]
      }}
      initial={{
        height: 0,
      }}
      animate={{
        height: open ? "auto" : "0",
        filter: open ? "blur(0px)" : "blur(5px)",
        opacity: open ? 1 : 0
      }}
    >
      <div className='w-px bg-input ml-4 mr-2' />
      <div className='flex-1 flex flex-col mt-2 gap-1'>
        {children}
      </div>
    </motion.div>

  </div>
}

export default ButtonGroup;