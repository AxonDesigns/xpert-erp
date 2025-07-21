import { createContextState } from "@frontend/components/create-context-state";
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useState,
} from "react";

const { Provider, contextHook } = createContextState<{
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

export function useSidebar() {
  return contextHook("useSidebar cannot be used outside of SidebarProvider");
}

const LOCAL_STORAGE_KEY = "sidebar-open";

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, _setIsOpen] = useState(() => {
    const open = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (open === null) {
      localStorage.setItem(LOCAL_STORAGE_KEY, "true");
      return true;
    }
    return open === "true";
  });

  const setIsOpen = useCallback((value: SetStateAction<boolean>) => {
    if (typeof value === "function") {
      const open = localStorage.getItem(LOCAL_STORAGE_KEY);
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        value(open === "true") ? "true" : "false",
      );
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY, value ? "true" : "false");
    }
    _setIsOpen(value);
  }, []);

  return <Provider value={{ isOpen, setIsOpen }}>{children}</Provider>;
}
