import { useState } from "react"
import { Button } from "./ui/button"
import { ChevronDown, Home } from "lucide-react";

interface ButtonGroupProps {
  children?: React.ReactNode
}

const ButtonGroup = ({ children }: ButtonGroupProps) => {
  const [open, setOpen] = useState(false);
  return <div className="flex flex-col">
    <Button
      variant="outline"
      className='group border-none'
      data-open={open}
      onClick={() => setOpen(!open)}
    >
      <Home />
      <span className='flex-1 text-left'>Option 1</span>
      <ChevronDown className='group-data-[open=true]:rotate-180 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]' />
    </Button>
    {open && (
      <div className="flex">
        <div className='w-px bg-input ml-4 mr-2' />
        <div className='flex-1 flex flex-col my-2 gap-1'>
          {children}
        </div>
      </div>
    )

    }
  </div>
}

export default ButtonGroup;