import { createBrowserLocalStorageAdapter, createGraphStore, loadSnapshot, saveSnapshot } from "@graph/core";
import { GraphEditor } from "@graph/editor";
import { GraphProvider } from "@graph/react";
import { useEffect, useState } from "react";
import { demoSchema } from "./demoSchema";

const graphId = "demo-graph";
const adapter = createBrowserLocalStorageAdapter();

export function App() {
  const [store] = useState(() => createGraphStore({ schema: demoSchema }));

  useEffect(() => {
    void loadSnapshot(adapter, graphId).then((snapshot) => {
      if (!snapshot) {
        return;
      }

      store.replaceState(snapshot);
    });

    return store.subscribe(() => {
      void saveSnapshot(adapter, graphId, store.getState());
    });
  }, [store]);

  return (
    <GraphProvider store={store}>
      <GraphEditor />
    </GraphProvider>
  );
}
