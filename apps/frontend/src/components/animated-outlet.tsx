import { getRouterContext, Outlet } from "@tanstack/react-router";
import { useIsPresent } from "motion/react";
import { forwardRef, useContext, useRef } from "react";
import { motion } from "motion/react";

const AnimatedOutlet = forwardRef<HTMLDivElement>((_, ref) => {
  const RouterContext = getRouterContext();

  const routerContext = useContext(RouterContext);

  const renderedContext = useRef(routerContext);

  const isPresent = useIsPresent();

  if (isPresent) {
    renderedContext.current = cloneDeep(routerContext);
  }

  return (
    <motion.div ref={ref} {...transitionProps}>
      <RouterContext.Provider value={renderedContext.current}>
        <Outlet />
      </RouterContext.Provider>
    </motion.div>
  );
});

export { AnimatedOutlet };