import type { GraphStorageAdapter } from "./persistence";
import type { GraphStoreState } from "./types";

export function createBrowserLocalStorageAdapter(storageKeyPrefix = "graph-modeling-module"): GraphStorageAdapter {
  return {
    async load(graphId: string) {
      const raw = window.localStorage.getItem(`${storageKeyPrefix}:${graphId}`);
      return raw ? (JSON.parse(raw) as GraphStoreState) : null;
    },
    async save(graphId: string, snapshot: GraphStoreState) {
      window.localStorage.setItem(`${storageKeyPrefix}:${graphId}`, JSON.stringify(snapshot));
    }
  };
}
