import type { GraphCommand, GraphStoreState } from "./types";

export type GraphStorageAdapter = {
  load(graphId: string): Promise<GraphStoreState | null>;
  save(graphId: string, snapshot: GraphStoreState): Promise<void>;
};

export type GraphSyncAdapter = {
  push(graphId: string, commands: GraphCommand[]): Promise<{ acknowledged: number }>;
};

export async function saveSnapshot(adapter: GraphStorageAdapter, graphId: string, state: GraphStoreState) {
  await adapter.save(graphId, structuredClone(state));
}

export async function loadSnapshot(adapter: GraphStorageAdapter, graphId: string) {
  return adapter.load(graphId);
}

export function createMemoryStorageAdapter(): GraphStorageAdapter {
  const storage = new Map<string, GraphStoreState>();

  return {
    async load(graphId) {
      return storage.get(graphId) ? structuredClone(storage.get(graphId)!) : null;
    },
    async save(graphId, snapshot) {
      storage.set(graphId, structuredClone(snapshot));
    }
  };
}

export function createRecordingSyncAdapter(options: { shouldFail: boolean }): GraphSyncAdapter {
  return {
    async push(_graphId, commands) {
      if (options.shouldFail) {
        throw new Error("network unavailable");
      }

      return { acknowledged: commands.length };
    }
  };
}

export async function flushPendingCommands(adapter: GraphSyncAdapter, graphId: string, commands: GraphCommand[]) {
  try {
    const result = await adapter.push(graphId, commands);
    return { acknowledged: result.acknowledged, status: "ok" as const };
  } catch {
    return { acknowledged: 0, status: "failed" as const };
  }
}
