import { useSyncExternalStore } from "react";
import type { GraphStoreState } from "@graph/core";
import { useGraphStore } from "./GraphProvider";

export function useGraphSelector<T>(selector: (state: GraphStoreState) => T) {
  const store = useGraphStore();
  const state = useSyncExternalStore(store.subscribe, store.getState);

  return selector(state);
}

export function useGraphDispatch() {
  return useGraphStore().dispatch;
}
