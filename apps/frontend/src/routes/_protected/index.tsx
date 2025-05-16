import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@frontend/components/ui/dialog'
import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { Flip } from 'gsap/Flip';
import { Button } from '@frontend/components/ui/button';
import gsap from 'gsap';

export const Route = createFileRoute('/_protected/')({
  component: RouteComponent,
})

function RouteComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const [open, setOpen] = useState(false);

  useGSAP(() => {
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
  })

  /*   const { context } = useGSAP(() => {
      if (open) {
        const state = Flip.getState([buttonRef.current, dialogRef.current]);
        console.log(state);
        Flip.from(state, {
          scale: true,
          duration: 0.5,
          ease: 'power1.inOut',
        })
      }
    }, {
      dependencies: [open],
      scope: containerRef
    }); */

  return (
    <>
      <main className='flex justify-center items-center bg-surface-1 animate-page-in flex-1 rounded-lg' ref={containerRef}>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className='button'>
              <h1>Hola</h1>
            </Button>
          </DialogTrigger>
          <DialogContent
            dianimate
            forceMount
            className='dialog-content'
            ref={dialogRef}
          >
            <DialogTitle>Hola</DialogTitle>
            <DialogDescription>Hola</DialogDescription>
          </DialogContent>
        </Dialog>
      </main>
    </>
  )
}
