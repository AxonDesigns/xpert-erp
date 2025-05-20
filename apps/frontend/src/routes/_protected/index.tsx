import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@frontend/components/ui/dialog'
import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react';
import { Button } from '@frontend/components/ui/button';
/* import { useGSAP } from '@gsap/react';
import { Flip } from 'gsap/Flip';
import gsap from 'gsap'; */

export const Route = createFileRoute('/_protected/')({
  component: RouteComponent,
})

function RouteComponent() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  /*useGSAP(() => {
    setTimeout(() => {
      Flip.fit(".dialog-content", ".button");
      const state = Flip.getState(".dialog-content");
      gsap.set(".dialog-content", { clearProps: true });
      Flip.from(state, {
        scale: true,
        duration: 0.5,
        ease: 'power1.inOut',
      })

    }, 1);

  }, {
    dependencies: [open],
    scope: containerRef
  }) */

  return (
    <>
      <main className='flex justify-center items-center bg-surface-1 animate-page-in flex-1 rounded-lg' ref={containerRef}>
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
