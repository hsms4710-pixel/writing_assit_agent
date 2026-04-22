import { useGraphSelector } from "@graph/react";

export function StatusBar() {
  const pendingCount = useGraphSelector((state) => state.pendingCommands.length);

  return <footer>Status: {pendingCount > 0 ? "dirty" : "clean"}</footer>;
}
