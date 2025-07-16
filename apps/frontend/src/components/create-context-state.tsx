import { createContext, useContext } from "react";

export function createContextState<T>(initialState: T) {
  const Context = createContext<T>(initialState);

  function contextHook(errorMessage?: string) {
    const context = useContext(Context);
    if (context === undefined) {
      throw new Error(errorMessage);
    }
    return context;
  }

  const Provider = Context.Provider;

  return {
    contextHook,
    Provider,
  }
}