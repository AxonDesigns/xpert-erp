import { createContextState } from "@frontend/components/create-context-state";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

const { Provider, contextHook } = createContextState<{
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}>({
  isOpen: false,
  setIsOpen: () => { },
});

export function useSidebar() {
  return contextHook("useSidebar cannot be used outside of SidebarProvider");
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  return <Provider value={{ isOpen, setIsOpen }}>
    {children}
  </Provider>;
}