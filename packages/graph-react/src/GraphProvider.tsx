import { createContext, type ReactNode, useContext } from "react";
import type { createGraphStore } from "@graph/core";

type GraphStore = ReturnType<typeof createGraphStore>;

const GraphStoreContext = createContext<GraphStore | null>(null);

export function GraphProvider(props: { store: GraphStore; children: ReactNode }) {
  return <GraphStoreContext.Provider value={props.store}>{props.children}</GraphStoreContext.Provider>;
}

export function useGraphStore() {
  const store = useContext(GraphStoreContext);

  if (!store) {
    throw new Error("useGraphStore must be used inside GraphProvider");
  }

  return store;
}
