import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@frontend/components/ui/dialog'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { Button } from '@frontend/components/ui/button';
export const Route = createFileRoute('/_protected/')({
  component: RouteComponent,
})

function RouteComponent() {

  const [open, setOpen] = useState(false);

  return (
    <>
      <main className='flex justify-center items-center bg-surface-1 animate-page-in flex-1 rounded-lg'>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className='button'>
              <h1>Click me</h1>
            </Button>
          </DialogTrigger>
          <DialogContent
            className='dialog-content'
          >
            <DialogTitle>Example title</DialogTitle>
            <DialogDescription>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, recusandae vel voluptatibus illo officiis nihil repudiandae dolor ullam amet aliquid rem, eum reprehenderit autem minima rerum suscipit quibusdam necessitatibus quod.</DialogDescription>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button>Ok</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </>
  )
}
