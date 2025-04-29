import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { useRouter, Outlet, type AnyRoute, useMatch } from '@tanstack/react-router';
import { motion, type MotionProps, AnimatePresence } from 'motion/react';

interface TransitionProps {
  initial?: MotionProps["initial"];
  animate?: MotionProps["animate"];
}

interface AnimatedOutletProps {
  enter: TransitionProps;
  exit: TransitionProps;
  transition?: MotionProps["transition"];
  from: AnyRoute['id']
  clone?: boolean
}


interface AnimatedOutletWrapperProps {
  children: React.ReactNode
}

type TakeSnapshotFn = () => void

type Registry = Map<string, TakeSnapshotFn>

const AnimatedOutletContext = createContext<Registry>(new Map())

function isDescendant(pathname: string, destinationPath: string) {
  return pathname === '/' ||
    (destinationPath.startsWith(pathname) &&
      (destinationPath.length === pathname.length ||
        destinationPath.charAt(pathname.length) === '/'))
}

export function AnimatedOutletWrapper({ children }: AnimatedOutletWrapperProps) {
  const router = useRouter();
  const registry = useRef<Registry>(new Map())

  useEffect(() => {
    // NOTE: This should be onBeforeNavigate, but due to https://github.com/TanStack/router/issues/3920 it's not working.
    // For now, we use onBeforeLoad, which runs right after onBeforeNavigate.
    // See: https://github.com/TanStack/router/blob/f8015e7629307499d4d6245077ad84145b6064a7/packages/router-core/src/router.ts#L2027
    const unsubscribe = router.subscribe('onBeforeLoad', ({ toLocation, pathChanged }) => {
      if (pathChanged) {
        const destinationPath = toLocation.pathname
        // Find the outlet with the longest pathname, that is part of the destination route
        let takeSnapshot: TakeSnapshotFn | null = null
        let longestLength = 0
        for (const [pathname, snapshotFn] of registry.current.entries()) {
          if (isDescendant(pathname, destinationPath) && pathname.length > longestLength) {
            longestLength = pathname.length
            takeSnapshot = snapshotFn
          }
        }
        if (takeSnapshot) {
          // Take a snapshot of the deepest outlet
          takeSnapshot()
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <AnimatedOutletContext.Provider value={registry.current}>
      {children}
    </AnimatedOutletContext.Provider>
  )
}

export function AnimatedOutlet({
  enter,
  exit,
  transition = { duration: 0.3 },
  from,
  clone = true
}: AnimatedOutletProps) {
  const [snapshots, setSnapshots] = useState<{ node: HTMLElement, id: number }[]>([]);
  const [pathname, setPathname] = useState<string | null>(null)
  const outletRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  const registry = useContext(AnimatedOutletContext)

  useEffect(() => {
    if (pathname) {
      registry.set(pathname, () => {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const outletNode = outletRef.current!;
        const snapshotNode = outletNode.firstChild as HTMLElement;
        if (snapshotNode) {
          let node = snapshotNode;
          if (clone) {
            node = snapshotNode.cloneNode(true) as HTMLElement;
          } else {
            outletNode.removeChild(snapshotNode)
          }
          const newSnapshot = { node, id: nextId.current++ }
          setSnapshots((prevSnapshots) => [...prevSnapshots, newSnapshot]);
        }
      });

      return () => { registry.delete(pathname) };
    }
  }, [registry, pathname, clone]);

  const handleAnimationComplete = (id: number) => {
    setSnapshots((prevSnapshots) =>
      prevSnapshots.filter((snapshot) => snapshot.id !== id)
    );
  };

  return (
    <>
      {pathname === null && <GetPathName setPathname={setPathname} from={from} />}
      <div className="relative w-full h-full">
        {snapshots.map((snapshot) => (
          <motion.div
            key={snapshot.id}
            className="absolute inset-0 pointer-events-none w-full h-full"
            initial={exit.initial}
            animate={exit.animate}
            transition={transition}
            onAnimationComplete={() => handleAnimationComplete(snapshot.id)}
            aria-hidden="true"
            ref={(el) => {
              if (el && snapshot.node) {
                el.appendChild(snapshot.node);
              }
            }}
          />
        ))}
        <motion.div
          key={nextId.current}
          ref={outletRef}
          className="relative w-full h-full"
          initial={enter.initial}
          animate={enter.animate}
          transition={transition}
        >
          <Outlet />
        </motion.div>
      </div>
    </>
  );
}

function GetPathName({ from, setPathname }: { from: AnyRoute['id'], setPathname: (pathname: string) => void }) {
  const match = useMatch({ from })
  useEffect(() => {
    setPathname(match.pathname)
  }, [match.pathname, setPathname])
  return null
}