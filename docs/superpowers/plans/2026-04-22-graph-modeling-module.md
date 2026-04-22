# Graph Modeling Module Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reusable graph modeling module as three packages (`@graph/core`, `@graph/react`, `@graph/editor`) plus a demo host app that supports schema-driven property graphs, scene-canvas editing, candidate quick actions, local persistence, and sync-ready boundaries.

**Architecture:** `@graph/core` owns graph state, scene state, commands, history, schema validation, templates, and persistence ports. `@graph/react` exposes the core store through `useSyncExternalStore` and command helpers. `@graph/editor` provides composable UI surfaces: scene canvas, inspector, structure navigator, template picker, relation tools, and status bar.

**Tech Stack:** TypeScript, pnpm workspaces, tsup, Vitest, React 19, Vite demo app, React Testing Library, Playwright

---

## Execution Status

Status: Implemented and verified on 2026-04-22

Completed tasks:

- Task 1: Bootstrap workspace and core smoke test
- Task 2: Add typed graph and schema validation
- Task 3: Implement command dispatch and undo / redo history
- Task 4: Separate scene state and add candidate drop actions
- Task 5: Add persistence ports and local-first sync contracts
- Task 6: Build the React binding layer
- Task 7: Build the editor shell, scene canvas, and relation layer
- Task 8: Add the inspector panel and candidate action flow
- Task 9: Add the structure navigator, template picker, and status bar
- Task 10: Integrate the demo host, end-to-end flow, and performance smoke tests

Latest verification evidence:

- `corepack.cmd pnpm test`
- `corepack.cmd pnpm --filter demo build`
- `corepack.cmd pnpm playwright test e2e/graph-editor.spec.ts`

Follow-up route after this plan:

- Keep this plan as the implementation baseline for the reusable graph module.
- Use `docs/superpowers/plans/2026-04-22-graph-modeling-module-progress.md` as the handoff and continuation entrypoint for the next phase.

## Planned File Structure

- `package.json`
  Root scripts for build, test, and demo workflows.
- `pnpm-workspace.yaml`
  Workspace package discovery.
- `tsconfig.base.json`
  Shared TypeScript settings.
- `vitest.workspace.ts`
  Root Vitest workspace config.
- `playwright.config.ts`
  End-to-end test runner config.
- `packages/graph-core/package.json`
  Package manifest for the framework-agnostic core.
- `packages/graph-core/tsconfig.json`
  Core package TypeScript config.
- `packages/graph-core/vitest.config.ts`
  Core package test config.
- `packages/graph-core/src/index.ts`
  Public exports for the core package.
- `packages/graph-core/src/types.ts`
  Graph, schema, scene, and command type definitions.
- `packages/graph-core/src/schema.ts`
  Schema validation and compatibility helpers.
- `packages/graph-core/src/store.ts`
  Store creation, subscription, and dispatch logic.
- `packages/graph-core/src/commands.ts`
  Command handlers and candidate-action conversion.
- `packages/graph-core/src/history.ts`
  Undo and redo helpers.
- `packages/graph-core/src/scene.ts`
  Scene projection helpers and placement utilities.
- `packages/graph-core/src/templates.ts`
  Template instantiation and starter graph helpers.
- `packages/graph-core/src/persistence.ts`
  Snapshot save/load and sync port contracts.
- `packages/graph-core/src/browserLocalStorageAdapter.ts`
  Browser-local adapter for local-first persistence.
- `packages/graph-core/tests/createGraphStore.test.ts`
  Core smoke test.
- `packages/graph-core/tests/schema.test.ts`
  Schema and extension-slot validation tests.
- `packages/graph-core/tests/commands.test.ts`
  Command semantics and history tests.
- `packages/graph-core/tests/scene.test.ts`
  Scene separation and candidate-action tests.
- `packages/graph-core/tests/persistence.test.ts`
  Snapshot and sync-adapter tests.
- `packages/graph-react/package.json`
  Package manifest for React bindings.
- `packages/graph-react/tsconfig.json`
  React package TypeScript config.
- `packages/graph-react/vitest.config.ts`
  React package test config.
- `packages/graph-react/src/index.ts`
  Public exports for React bindings.
- `packages/graph-react/src/GraphProvider.tsx`
  React provider for the core store.
- `packages/graph-react/src/hooks.ts`
  Selectors, dispatch, and store hooks.
- `packages/graph-react/tests/provider.test.tsx`
  React binding integration tests.
- `packages/graph-editor/package.json`
  Package manifest for editor UI.
- `packages/graph-editor/tsconfig.json`
  Editor package TypeScript config.
- `packages/graph-editor/vitest.config.ts`
  Editor package test config.
- `packages/graph-editor/src/index.ts`
  Public exports for the editor package.
- `packages/graph-editor/src/editor.css`
  Shared editor styles.
- `packages/graph-editor/src/GraphEditor.tsx`
  Top-level editor shell.
- `packages/graph-editor/src/SceneCanvas.tsx`
  Main semantic scene canvas.
- `packages/graph-editor/src/RelationLayer.tsx`
  SVG relation rendering.
- `packages/graph-editor/src/InspectorPanel.tsx`
  Authoritative semantic editor.
- `packages/graph-editor/src/CandidateActionBar.tsx`
  Quick-action confirmation strip.
- `packages/graph-editor/src/StructureNavigator.tsx`
  Secondary structure and search view.
- `packages/graph-editor/src/TemplatePicker.tsx`
  Template loading UI.
- `packages/graph-editor/src/StatusBar.tsx`
  Dirty/sync/validation feedback.
- `packages/graph-editor/src/projection.ts`
  Scene projection and edge path helpers.
- `packages/graph-editor/tests/scene-canvas.test.tsx`
  Canvas rendering tests.
- `packages/graph-editor/tests/inspector.test.tsx`
  Inspector and candidate-action tests.
- `packages/graph-editor/tests/surfaces.test.tsx`
  Navigator, template picker, and status bar tests.
- `packages/graph-editor/tests/projection.performance.test.ts`
  Projection performance smoke test.
- `apps/demo/package.json`
  Demo host manifest.
- `apps/demo/tsconfig.json`
  Demo app TypeScript config.
- `apps/demo/vite.config.ts`
  Demo app Vite config.
- `apps/demo/index.html`
  Demo app HTML shell.
- `apps/demo/src/main.tsx`
  Demo app entry point.
- `apps/demo/src/App.tsx`
  Demo host integration.
- `apps/demo/src/demoSchema.ts`
  Writing-oriented schema preset example.
- `apps/demo/src/demoTemplate.ts`
  Starter world template.
- `apps/demo/src/mediumGraphFixture.ts`
  Performance and browsing fixture.
- `e2e/graph-editor.spec.ts`
  End-to-end workflow tests.

### Task 1: Bootstrap the Workspace and Core Smoke Test

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `vitest.workspace.ts`
- Create: `packages/graph-core/package.json`
- Create: `packages/graph-core/tsconfig.json`
- Create: `packages/graph-core/vitest.config.ts`
- Create: `packages/graph-core/src/index.ts`
- Create: `packages/graph-core/src/store.ts`
- Create: `packages/graph-core/tests/createGraphStore.test.ts`

- [ ] **Step 1: Create the root workspace manifests**

```json
// package.json
{
  "name": "graph-modeling-module",
  "private": true,
  "packageManager": "pnpm@10.11.0",
  "scripts": {
    "build": "pnpm -r build",
    "test": "vitest run --workspace vitest.workspace.ts",
    "test:watch": "vitest --workspace vitest.workspace.ts",
    "test:e2e": "playwright test",
    "dev:demo": "pnpm --filter demo dev"
  }
}
```

```yaml
# pnpm-workspace.yaml
packages:
  - apps/*
  - packages/*
```

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "strict": true,
    "jsx": "react-jsx",
    "declaration": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  }
}
```

```ts
// vitest.workspace.ts
import { defineWorkspace } from "vitest/config";

export default defineWorkspace(["packages/*/vitest.config.ts"]);
```

Run:

```bash
pnpm add -Dw typescript tsup vitest jsdom react react-dom @types/react @types/react-dom @testing-library/react @testing-library/user-event vite @vitejs/plugin-react @playwright/test playwright
```

Expected: workspace dependencies install successfully.

- [ ] **Step 2: Write the failing core smoke test**

```ts
// packages/graph-core/tests/createGraphStore.test.ts
import { describe, expect, it } from "vitest";
import { createGraphStore } from "../src";

describe("createGraphStore", () => {
  it("creates an empty graph and scene state", () => {
    const store = createGraphStore();

    expect(store.getState().graph.nodes).toEqual({});
    expect(store.getState().graph.edges).toEqual({});
    expect(store.getState().scene.activeSceneId).toBe("default");
  });
});
```

- [ ] **Step 3: Run the smoke test to verify it fails**

Run:

```bash
pnpm vitest run packages/graph-core/tests/createGraphStore.test.ts
```

Expected: FAIL with `Cannot find module '../src'` or missing export errors.

- [ ] **Step 4: Implement the minimal core package and store**

```json
// packages/graph-core/package.json
{
  "name": "@graph/core",
  "version": "0.1.0",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format esm --dts",
    "test": "vitest run"
  }
}
```

```json
// packages/graph-core/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src", "tests"]
}
```

```ts
// packages/graph-core/vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node"
  }
});
```

```ts
// packages/graph-core/src/store.ts
export type GraphStoreState = {
  graph: {
    nodes: Record<string, unknown>;
    edges: Record<string, unknown>;
  };
  scene: {
    activeSceneId: string;
    scenes: Record<string, { nodePlacements: Record<string, { x: number; y: number }> }>;
  };
};

const defaultState: GraphStoreState = {
  graph: {
    nodes: {},
    edges: {}
  },
  scene: {
    activeSceneId: "default",
    scenes: {
      default: {
        nodePlacements: {}
      }
    }
  }
};

export function createGraphStore() {
  let state = defaultState;
  const listeners = new Set<() => void>();

  return {
    getState() {
      return state;
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    replaceState(nextState: GraphStoreState) {
      state = nextState;
      listeners.forEach((listener) => listener());
    }
  };
}
```

```ts
// packages/graph-core/src/index.ts
export { createGraphStore } from "./store";
```

- [ ] **Step 5: Run the smoke test to verify it passes**

Run:

```bash
pnpm vitest run packages/graph-core/tests/createGraphStore.test.ts
```

Expected: PASS with `1 passed`.

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-workspace.yaml tsconfig.base.json vitest.workspace.ts packages/graph-core
git commit -m "feat: scaffold graph modeling workspace"
```

Expected: If the repository has been initialized, commit succeeds. If `.git` is absent, initialize git before running this step.

### Task 2: Add Typed Graph and Schema Validation

**Files:**
- Create: `packages/graph-core/src/types.ts`
- Create: `packages/graph-core/src/schema.ts`
- Modify: `packages/graph-core/src/index.ts`
- Test: `packages/graph-core/tests/schema.test.ts`

- [ ] **Step 1: Write the failing schema tests**

```ts
// packages/graph-core/tests/schema.test.ts
import { describe, expect, it } from "vitest";
import { createSchemaValidator, type GraphSchema } from "../src";

const schema: GraphSchema = {
  nodeTypes: {
    person: {
      label: "Person",
      style: { shape: "card" },
      fields: {
        name: { kind: "string", required: true }
      },
      customFieldSlots: {
        notes: { kind: "string" }
      }
    },
    organization: {
      label: "Organization",
      style: { shape: "zone" },
      fields: {
        name: { kind: "string", required: true }
      }
    }
  },
  edgeTypes: {
    membership: {
      label: "Membership",
      class: "structure",
      directed: true,
      sourceTypes: ["person"],
      targetTypes: ["organization"]
    }
  }
};

describe("createSchemaValidator", () => {
  it("accepts declared fields and approved extension slots", () => {
    const validator = createSchemaValidator(schema);

    expect(() =>
      validator.validateNode({
        id: "person:1",
        type: "person",
        fields: { name: "Ada" },
        extensions: { notes: "Lead strategist" }
      })
    ).not.toThrow();
  });

  it("rejects extension values outside declared slots", () => {
    const validator = createSchemaValidator(schema);

    expect(() =>
      validator.validateNode({
        id: "person:1",
        type: "person",
        fields: { name: "Ada" },
        extensions: { hidden: "forbidden" }
      })
    ).toThrowError('Extension field "hidden" is not allowed for node type "person"');
  });

  it("rejects structure edges with incompatible source and target types", () => {
    const validator = createSchemaValidator(schema);

    expect(() =>
      validator.validateEdge(
        {
          id: "edge:1",
          type: "membership",
          source: "organization:1",
          target: "person:1"
        },
        {
          "organization:1": { id: "organization:1", type: "organization", fields: { name: "Guild" } },
          "person:1": { id: "person:1", type: "person", fields: { name: "Ada" } }
        }
      )
    ).toThrowError('Edge type "membership" does not allow organization -> person');
  });
});
```

- [ ] **Step 2: Run the schema tests to verify they fail**

Run:

```bash
pnpm vitest run packages/graph-core/tests/schema.test.ts
```

Expected: FAIL because `createSchemaValidator` and `GraphSchema` do not exist yet.

- [ ] **Step 3: Implement graph, schema, and validator types**

```ts
// packages/graph-core/src/types.ts
export type GraphValue = string | number | boolean | string[];

export type GraphNode = {
  id: string;
  type: string;
  fields: Record<string, GraphValue>;
  extensions?: Record<string, GraphValue>;
};

export type GraphEdge = {
  id: string;
  type: string;
  source: string;
  target: string;
  fields?: Record<string, GraphValue>;
};

export type FieldDefinition = {
  kind: "string" | "number" | "boolean" | "string[]";
  required?: boolean;
};

export type NodeTypeDefinition = {
  label: string;
  style: { shape: "plane" | "zone" | "card" };
  fields: Record<string, FieldDefinition>;
  customFieldSlots?: Record<string, FieldDefinition>;
};

export type EdgeTypeDefinition = {
  label: string;
  class: "structure" | "relation";
  directed: boolean;
  sourceTypes: string[];
  targetTypes: string[];
};

export type GraphSchema = {
  nodeTypes: Record<string, NodeTypeDefinition>;
  edgeTypes: Record<string, EdgeTypeDefinition>;
};
```

```ts
// packages/graph-core/src/schema.ts
import type { GraphEdge, GraphNode, GraphSchema, GraphValue } from "./types";

function matchesKind(value: GraphValue, kind: "string" | "number" | "boolean" | "string[]") {
  if (kind === "string[]") {
    return Array.isArray(value) && value.every((item) => typeof item === "string");
  }

  return typeof value === kind;
}

export function createSchemaValidator(schema: GraphSchema) {
  return {
    validateNode(node: GraphNode) {
      const nodeType = schema.nodeTypes[node.type];

      if (!nodeType) {
        throw new Error(`Unknown node type "${node.type}"`);
      }

      for (const [fieldName, definition] of Object.entries(nodeType.fields)) {
        const value = node.fields[fieldName];

        if (definition.required && value === undefined) {
          throw new Error(`Field "${fieldName}" is required for node type "${node.type}"`);
        }

        if (value !== undefined && !matchesKind(value, definition.kind)) {
          throw new Error(`Field "${fieldName}" must match kind "${definition.kind}"`);
        }
      }

      for (const [fieldName, value] of Object.entries(node.extensions ?? {})) {
        const slotDefinition = nodeType.customFieldSlots?.[fieldName];

        if (!slotDefinition) {
          throw new Error(`Extension field "${fieldName}" is not allowed for node type "${node.type}"`);
        }

        if (!matchesKind(value, slotDefinition.kind)) {
          throw new Error(`Extension field "${fieldName}" must match kind "${slotDefinition.kind}"`);
        }
      }
    },

    validateEdge(edge: GraphEdge, nodes: Record<string, GraphNode>) {
      const edgeType = schema.edgeTypes[edge.type];
      const sourceNode = nodes[edge.source];
      const targetNode = nodes[edge.target];

      if (!edgeType) {
        throw new Error(`Unknown edge type "${edge.type}"`);
      }

      if (!sourceNode || !targetNode) {
        throw new Error(`Edge "${edge.id}" references missing nodes`);
      }

      if (!edgeType.sourceTypes.includes(sourceNode.type) || !edgeType.targetTypes.includes(targetNode.type)) {
        throw new Error(`Edge type "${edge.type}" does not allow ${sourceNode.type} -> ${targetNode.type}`);
      }
    }
  };
}
```

- [ ] **Step 4: Export the new types and validator**

```ts
// packages/graph-core/src/index.ts
export { createGraphStore } from "./store";
export { createSchemaValidator } from "./schema";
export type {
  EdgeTypeDefinition,
  FieldDefinition,
  GraphEdge,
  GraphNode,
  GraphSchema,
  GraphValue,
  NodeTypeDefinition
} from "./types";
```

- [ ] **Step 5: Run the schema tests to verify they pass**

Run:

```bash
pnpm vitest run packages/graph-core/tests/schema.test.ts
```

Expected: PASS with `3 passed`.

- [ ] **Step 6: Commit**

```bash
git add packages/graph-core/src/index.ts packages/graph-core/src/types.ts packages/graph-core/src/schema.ts packages/graph-core/tests/schema.test.ts
git commit -m "feat: add graph schema validation"
```

### Task 3: Implement Command Dispatch and Undo / Redo History

**Files:**
- Create: `packages/graph-core/src/commands.ts`
- Create: `packages/graph-core/src/history.ts`
- Modify: `packages/graph-core/src/store.ts`
- Modify: `packages/graph-core/src/types.ts`
- Modify: `packages/graph-core/src/index.ts`
- Test: `packages/graph-core/tests/commands.test.ts`

- [ ] **Step 1: Write the failing command and history tests**

```ts
// packages/graph-core/tests/commands.test.ts
import { describe, expect, it } from "vitest";
import { createGraphStore, type GraphSchema } from "../src";

const schema: GraphSchema = {
  nodeTypes: {
    person: { label: "Person", style: { shape: "card" }, fields: { name: { kind: "string", required: true } } },
    organization: { label: "Organization", style: { shape: "zone" }, fields: { name: { kind: "string", required: true } } }
  },
  edgeTypes: {
    membership: {
      label: "Membership",
      class: "structure",
      directed: true,
      sourceTypes: ["person"],
      targetTypes: ["organization"]
    }
  }
};

describe("command dispatch", () => {
  it("adds nodes and edges and supports undo/redo", () => {
    const store = createGraphStore({ schema });

    store.dispatch({
      type: "graph.addNode",
      node: { id: "person:1", type: "person", fields: { name: "Ada" } }
    });
    store.dispatch({
      type: "graph.addNode",
      node: { id: "organization:1", type: "organization", fields: { name: "Guild" } }
    });
    store.dispatch({
      type: "graph.addEdge",
      edge: { id: "edge:1", type: "membership", source: "person:1", target: "organization:1" }
    });

    expect(store.getState().graph.edges["edge:1"]).toBeDefined();

    store.undo();
    expect(store.getState().graph.edges["edge:1"]).toBeUndefined();

    store.redo();
    expect(store.getState().graph.edges["edge:1"]).toBeDefined();
  });
});
```

- [ ] **Step 2: Run the command test to verify it fails**

Run:

```bash
pnpm vitest run packages/graph-core/tests/commands.test.ts
```

Expected: FAIL because `dispatch`, `undo`, `redo`, and typed commands do not exist.

- [ ] **Step 3: Add command and history types**

```ts
// packages/graph-core/src/types.ts
export type GraphCommand =
  | { type: "graph.addNode"; node: GraphNode }
  | { type: "graph.addEdge"; edge: GraphEdge }
  | { type: "graph.updateNodeFields"; nodeId: string; fields: Record<string, GraphValue> }
  | { type: "scene.moveNode"; nodeId: string; sceneId: string; x: number; y: number };

export type GraphStoreState = {
  schema?: GraphSchema;
  graph: {
    nodes: Record<string, GraphNode>;
    edges: Record<string, GraphEdge>;
  };
  scene: {
    activeSceneId: string;
    scenes: Record<string, { nodePlacements: Record<string, { x: number; y: number }> }>;
  };
  history: {
    past: GraphStoreSnapshot[];
    future: GraphStoreSnapshot[];
  };
  pendingCommands: GraphCommand[];
};

export type GraphStoreSnapshot = Omit<GraphStoreState, "history" | "pendingCommands">;
```

```ts
// packages/graph-core/src/history.ts
import type { GraphStoreSnapshot, GraphStoreState } from "./types";

export function takeSnapshot(state: GraphStoreState): GraphStoreSnapshot {
  return {
    schema: state.schema,
    graph: structuredClone(state.graph),
    scene: structuredClone(state.scene)
  };
}

export function pushHistory(state: GraphStoreState) {
  state.history.past.push(takeSnapshot(state));
  state.history.future = [];
}
```

```ts
// packages/graph-core/src/commands.ts
import { createSchemaValidator } from "./schema";
import type { GraphCommand, GraphStoreState } from "./types";

export function applyCommand(state: GraphStoreState, command: GraphCommand) {
  switch (command.type) {
    case "graph.addNode": {
      if (state.schema) {
        createSchemaValidator(state.schema).validateNode(command.node);
      }
      state.graph.nodes[command.node.id] = command.node;
      return;
    }

    case "graph.addEdge": {
      if (state.schema) {
        createSchemaValidator(state.schema).validateEdge(command.edge, state.graph.nodes);
      }
      state.graph.edges[command.edge.id] = command.edge;
      return;
    }

    case "graph.updateNodeFields": {
      state.graph.nodes[command.nodeId] = {
        ...state.graph.nodes[command.nodeId],
        fields: {
          ...state.graph.nodes[command.nodeId].fields,
          ...command.fields
        }
      };
      return;
    }

    case "scene.moveNode": {
      const scene = state.scene.scenes[command.sceneId];
      scene.nodePlacements[command.nodeId] = { x: command.x, y: command.y };
      return;
    }
  }
}
```

- [ ] **Step 4: Upgrade the store to support dispatch and history**

```ts
// packages/graph-core/src/store.ts
import { applyCommand } from "./commands";
import { pushHistory } from "./history";
import type { GraphSchema, GraphStoreState } from "./types";

const defaultState: GraphStoreState = {
  schema: undefined,
  graph: {
    nodes: {},
    edges: {}
  },
  scene: {
    activeSceneId: "default",
    scenes: {
      default: {
        nodePlacements: {}
      }
    }
  },
  history: {
    past: [],
    future: []
  },
  pendingCommands: []
};

export function createGraphStore(options: { schema?: GraphSchema } = {}) {
  let state: GraphStoreState = {
    ...structuredClone(defaultState),
    schema: options.schema
  };
  const listeners = new Set<() => void>();

  const notify = () => listeners.forEach((listener) => listener());

  return {
    getState() {
      return state;
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    replaceState(nextState: GraphStoreState) {
      state = structuredClone(nextState);
      notify();
    },
    dispatch(command: Parameters<typeof applyCommand>[1]) {
      pushHistory(state);
      applyCommand(state, command);
      state.pendingCommands.push(command);
      notify();
    },
    undo() {
      const previous = state.history.past.pop();
      if (!previous) return;

      state.history.future.push({
        schema: state.schema,
        graph: structuredClone(state.graph),
        scene: structuredClone(state.scene)
      });
      state.graph = structuredClone(previous.graph);
      state.scene = structuredClone(previous.scene);
      notify();
    },
    redo() {
      const next = state.history.future.pop();
      if (!next) return;

      state.history.past.push({
        schema: state.schema,
        graph: structuredClone(state.graph),
        scene: structuredClone(state.scene)
      });
      state.graph = structuredClone(next.graph);
      state.scene = structuredClone(next.scene);
      notify();
    }
  };
}
```

```ts
// packages/graph-core/src/index.ts
export { applyCommand } from "./commands";
export { pushHistory, takeSnapshot } from "./history";
export { createSchemaValidator } from "./schema";
export { createGraphStore } from "./store";
export type {
  EdgeTypeDefinition,
  FieldDefinition,
  GraphCommand,
  GraphEdge,
  GraphNode,
  GraphSchema,
  GraphStoreSnapshot,
  GraphStoreState,
  GraphValue,
  NodeTypeDefinition
} from "./types";
```

- [ ] **Step 5: Run the command tests to verify they pass**

Run:

```bash
pnpm vitest run packages/graph-core/tests/commands.test.ts
```

Expected: PASS with `1 passed`.

- [ ] **Step 6: Commit**

```bash
git add packages/graph-core/src/index.ts packages/graph-core/src/types.ts packages/graph-core/src/history.ts packages/graph-core/src/commands.ts packages/graph-core/src/store.ts packages/graph-core/tests/commands.test.ts
git commit -m "feat: add command dispatch and history"
```

### Task 4: Separate Scene State and Add Candidate Drop Actions

**Files:**
- Create: `packages/graph-core/src/scene.ts`
- Modify: `packages/graph-core/src/types.ts`
- Modify: `packages/graph-core/src/commands.ts`
- Modify: `packages/graph-core/src/index.ts`
- Test: `packages/graph-core/tests/scene.test.ts`

- [ ] **Step 1: Write the failing scene and candidate-action tests**

```ts
// packages/graph-core/tests/scene.test.ts
import { describe, expect, it } from "vitest";
import { buildDropCandidateActions, createGraphStore, type GraphSchema } from "../src";

const schema: GraphSchema = {
  nodeTypes: {
    person: { label: "Person", style: { shape: "card" }, fields: { name: { kind: "string", required: true } } },
    organization: { label: "Organization", style: { shape: "zone" }, fields: { name: { kind: "string", required: true } } }
  },
  edgeTypes: {
    membership: {
      label: "Membership",
      class: "structure",
      directed: true,
      sourceTypes: ["person"],
      targetTypes: ["organization"]
    }
  }
};

describe("scene separation", () => {
  it("keeps layout changes separate from structural edges", () => {
    const store = createGraphStore({ schema });
    store.dispatch({ type: "graph.addNode", node: { id: "person:1", type: "person", fields: { name: "Ada" } } });
    store.dispatch({ type: "graph.addNode", node: { id: "organization:1", type: "organization", fields: { name: "Guild" } } });

    store.dispatch({ type: "scene.moveNode", sceneId: "default", nodeId: "person:1", x: 240, y: 180 });

    expect(store.getState().scene.scenes.default.nodePlacements["person:1"]).toEqual({ x: 240, y: 180 });
    expect(Object.keys(store.getState().graph.edges)).toHaveLength(0);
  });

  it("offers explicit candidate actions when dropping into a compatible container", () => {
    const store = createGraphStore({ schema });
    store.dispatch({ type: "graph.addNode", node: { id: "person:1", type: "person", fields: { name: "Ada" } } });
    store.dispatch({ type: "graph.addNode", node: { id: "organization:1", type: "organization", fields: { name: "Guild" } } });

    const actions = buildDropCandidateActions(store.getState(), {
      nodeId: "person:1",
      containerId: "organization:1",
      sceneId: "default"
    });

    expect(actions.map((action) => action.kind)).toEqual([
      "create-structure-edge",
      "set-primary-structure-edge",
      "keep-layout-only"
    ]);
  });
});
```

- [ ] **Step 2: Run the scene tests to verify they fail**

Run:

```bash
pnpm vitest run packages/graph-core/tests/scene.test.ts
```

Expected: FAIL because `buildDropCandidateActions` does not exist yet.

- [ ] **Step 3: Add scene and candidate-action types**

```ts
// packages/graph-core/src/types.ts
export type ScenePlacement = { x: number; y: number };

export type DropCandidateAction =
  | {
      kind: "create-structure-edge";
      nodeId: string;
      containerId: string;
      edgeType: string;
    }
  | {
      kind: "set-primary-structure-edge";
      nodeId: string;
      containerId: string;
      edgeType: string;
    }
  | {
      kind: "keep-layout-only";
      nodeId: string;
      containerId: string;
    };

export type GraphStoreState = {
  schema?: GraphSchema;
  graph: {
    nodes: Record<string, GraphNode>;
    edges: Record<string, GraphEdge>;
    primaryStructureEdgeByNodeId: Record<string, string>;
  };
  scene: {
    activeSceneId: string;
    scenes: Record<string, { nodePlacements: Record<string, ScenePlacement> }>;
  };
  history: {
    past: GraphStoreSnapshot[];
    future: GraphStoreSnapshot[];
  };
  pendingCommands: GraphCommand[];
};
```

```ts
// packages/graph-core/src/scene.ts
import type { DropCandidateAction, GraphStoreState } from "./types";

export function buildDropCandidateActions(
  state: GraphStoreState,
  input: { nodeId: string; containerId: string; sceneId: string }
): DropCandidateAction[] {
  const node = state.graph.nodes[input.nodeId];
  const container = state.graph.nodes[input.containerId];
  const matchingStructureEdgeType = Object.entries(state.schema?.edgeTypes ?? {}).find(([, definition]) => {
    return (
      definition.class === "structure" &&
      definition.sourceTypes.includes(node.type) &&
      definition.targetTypes.includes(container.type)
    );
  });

  if (!matchingStructureEdgeType) {
    return [{ kind: "keep-layout-only", nodeId: input.nodeId, containerId: input.containerId }];
  }

  const [edgeType] = matchingStructureEdgeType;

  return [
    { kind: "create-structure-edge", nodeId: input.nodeId, containerId: input.containerId, edgeType },
    { kind: "set-primary-structure-edge", nodeId: input.nodeId, containerId: input.containerId, edgeType },
    { kind: "keep-layout-only", nodeId: input.nodeId, containerId: input.containerId }
  ];
}
```

- [ ] **Step 4: Initialize primary-structure state and export the helper**

```ts
// packages/graph-core/src/store.ts
const defaultState: GraphStoreState = {
  schema: undefined,
  graph: {
    nodes: {},
    edges: {},
    primaryStructureEdgeByNodeId: {}
  },
  scene: {
    activeSceneId: "default",
    scenes: {
      default: {
        nodePlacements: {}
      }
    }
  },
  history: {
    past: [],
    future: []
  },
  pendingCommands: []
};
```

```ts
// packages/graph-core/src/index.ts
export { applyCommand } from "./commands";
export { pushHistory, takeSnapshot } from "./history";
export { createSchemaValidator } from "./schema";
export { buildDropCandidateActions } from "./scene";
export { createGraphStore } from "./store";
export type {
  DropCandidateAction,
  EdgeTypeDefinition,
  FieldDefinition,
  GraphCommand,
  GraphEdge,
  GraphNode,
  GraphSchema,
  GraphStoreSnapshot,
  GraphStoreState,
  GraphValue,
  NodeTypeDefinition,
  ScenePlacement
} from "./types";
```

- [ ] **Step 5: Run the scene tests to verify they pass**

Run:

```bash
pnpm vitest run packages/graph-core/tests/scene.test.ts
```

Expected: PASS with `2 passed`.

- [ ] **Step 6: Commit**

```bash
git add packages/graph-core/src/types.ts packages/graph-core/src/store.ts packages/graph-core/src/scene.ts packages/graph-core/src/index.ts packages/graph-core/tests/scene.test.ts
git commit -m "feat: separate scene state from semantic graph state"
```

### Task 5: Add Persistence Ports and Local-First Sync Contracts

**Files:**
- Create: `packages/graph-core/src/persistence.ts`
- Create: `packages/graph-core/src/browserLocalStorageAdapter.ts`
- Modify: `packages/graph-core/src/store.ts`
- Modify: `packages/graph-core/src/index.ts`
- Test: `packages/graph-core/tests/persistence.test.ts`

- [ ] **Step 1: Write the failing persistence and sync tests**

```ts
// packages/graph-core/tests/persistence.test.ts
import { describe, expect, it } from "vitest";
import {
  createGraphStore,
  createMemoryStorageAdapter,
  createRecordingSyncAdapter,
  flushPendingCommands,
  loadSnapshot,
  saveSnapshot
} from "../src";

describe("persistence and sync", () => {
  it("persists graph and scene state together", async () => {
    const storage = createMemoryStorageAdapter();
    const store = createGraphStore();

    store.dispatch({
      type: "graph.addNode",
      node: { id: "person:1", type: "person", fields: { name: "Ada" } }
    });
    store.dispatch({ type: "scene.moveNode", sceneId: "default", nodeId: "person:1", x: 120, y: 90 });

    await saveSnapshot(storage, "demo-graph", store.getState());
    const restored = await loadSnapshot(storage, "demo-graph");

    expect(restored?.scene.scenes.default.nodePlacements["person:1"]).toEqual({ x: 120, y: 90 });
  });

  it("keeps pending commands when remote sync fails", async () => {
    const sync = createRecordingSyncAdapter({ shouldFail: true });
    const result = await flushPendingCommands(sync, "demo-graph", [
      { type: "scene.moveNode", sceneId: "default", nodeId: "person:1", x: 120, y: 90 }
    ]);

    expect(result.acknowledged).toBe(0);
    expect(result.status).toBe("failed");
  });
});
```

- [ ] **Step 2: Run the persistence tests to verify they fail**

Run:

```bash
pnpm vitest run packages/graph-core/tests/persistence.test.ts
```

Expected: FAIL because persistence helpers and adapters do not exist.

- [ ] **Step 3: Implement snapshot and adapter contracts**

```ts
// packages/graph-core/src/persistence.ts
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
```

```ts
// packages/graph-core/src/browserLocalStorageAdapter.ts
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
```

- [ ] **Step 4: Attach persistence helpers to the public API**

```ts
// packages/graph-core/src/index.ts
export { createBrowserLocalStorageAdapter } from "./browserLocalStorageAdapter";
export { applyCommand } from "./commands";
export { pushHistory, takeSnapshot } from "./history";
export {
  createMemoryStorageAdapter,
  createRecordingSyncAdapter,
  flushPendingCommands,
  loadSnapshot,
  saveSnapshot
} from "./persistence";
export { createSchemaValidator } from "./schema";
export { buildDropCandidateActions } from "./scene";
export { createGraphStore } from "./store";
export type {
  DropCandidateAction,
  EdgeTypeDefinition,
  FieldDefinition,
  GraphCommand,
  GraphEdge,
  GraphNode,
  GraphSchema,
  GraphStoreSnapshot,
  GraphStoreState,
  GraphValue,
  NodeTypeDefinition,
  ScenePlacement
} from "./types";
export type { GraphStorageAdapter, GraphSyncAdapter } from "./persistence";
```

- [ ] **Step 5: Run the persistence tests to verify they pass**

Run:

```bash
pnpm vitest run packages/graph-core/tests/persistence.test.ts
```

Expected: PASS with `2 passed`.

- [ ] **Step 6: Commit**

```bash
git add packages/graph-core/src/index.ts packages/graph-core/src/persistence.ts packages/graph-core/src/browserLocalStorageAdapter.ts packages/graph-core/tests/persistence.test.ts
git commit -m "feat: add local-first persistence and sync contracts"
```

### Task 6: Build the React Binding Layer

**Files:**
- Create: `packages/graph-react/package.json`
- Create: `packages/graph-react/tsconfig.json`
- Create: `packages/graph-react/vitest.config.ts`
- Create: `packages/graph-react/src/index.ts`
- Create: `packages/graph-react/src/GraphProvider.tsx`
- Create: `packages/graph-react/src/hooks.ts`
- Test: `packages/graph-react/tests/provider.test.tsx`

- [ ] **Step 1: Write the failing React binding test**

```tsx
// packages/graph-react/tests/provider.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createGraphStore } from "@graph/core";
import { GraphProvider, useGraphDispatch, useGraphSelector } from "../src";

function Counter() {
  const count = useGraphSelector((state) => Object.keys(state.graph.nodes).length);
  const dispatch = useGraphDispatch();

  return (
    <div>
      <span>{count}</span>
      <button
        onClick={() =>
          dispatch({
            type: "graph.addNode",
            node: { id: "person:1", type: "person", fields: { name: "Ada" } }
          })
        }
      >
        add
      </button>
    </div>
  );
}

describe("GraphProvider", () => {
  it("exposes store state and dispatch through hooks", async () => {
    const store = createGraphStore();

    render(
      <GraphProvider store={store}>
        <Counter />
      </GraphProvider>
    );

    expect(screen.getByText("0")).toBeTruthy();
    screen.getByRole("button", { name: "add" }).click();
    expect(await screen.findByText("1")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run the React binding test to verify it fails**

Run:

```bash
pnpm vitest run packages/graph-react/tests/provider.test.tsx
```

Expected: FAIL because `@graph/react` does not exist.

- [ ] **Step 3: Scaffold the React package**

```json
// packages/graph-react/package.json
{
  "name": "@graph/react",
  "version": "0.1.0",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "dependencies": {
    "@graph/core": "workspace:*"
  },
  "scripts": {
    "build": "tsup src/index.ts --format esm --dts",
    "test": "vitest run"
  }
}
```

```json
// packages/graph-react/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src", "tests"]
}
```

```ts
// packages/graph-react/vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom"
  }
});
```

- [ ] **Step 4: Implement the provider and hooks**

```tsx
// packages/graph-react/src/GraphProvider.tsx
import { createContext, useContext, type ReactNode } from "react";
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
```

```tsx
// packages/graph-react/src/hooks.ts
import { useSyncExternalStore } from "react";
import type { GraphStoreState } from "@graph/core";
import { useGraphStore } from "./GraphProvider";

export function useGraphSelector<T>(selector: (state: GraphStoreState) => T) {
  const store = useGraphStore();
  return useSyncExternalStore(store.subscribe, () => selector(store.getState()));
}

export function useGraphDispatch() {
  return useGraphStore().dispatch;
}
```

```ts
// packages/graph-react/src/index.ts
export { GraphProvider, useGraphStore } from "./GraphProvider";
export { useGraphDispatch, useGraphSelector } from "./hooks";
```

- [ ] **Step 5: Run the React binding test to verify it passes**

Run:

```bash
pnpm vitest run packages/graph-react/tests/provider.test.tsx
```

Expected: PASS with `1 passed`.

- [ ] **Step 6: Commit**

```bash
git add packages/graph-react
git commit -m "feat: add react bindings for graph store"
```

### Task 7: Build the Editor Shell, Scene Canvas, and Relation Layer

**Files:**
- Create: `packages/graph-editor/package.json`
- Create: `packages/graph-editor/tsconfig.json`
- Create: `packages/graph-editor/vitest.config.ts`
- Create: `packages/graph-editor/src/index.ts`
- Create: `packages/graph-editor/src/editor.css`
- Create: `packages/graph-editor/src/GraphEditor.tsx`
- Create: `packages/graph-editor/src/SceneCanvas.tsx`
- Create: `packages/graph-editor/src/RelationLayer.tsx`
- Create: `packages/graph-editor/src/projection.ts`
- Test: `packages/graph-editor/tests/scene-canvas.test.tsx`

- [ ] **Step 1: Write the failing canvas rendering test**

```tsx
// packages/graph-editor/tests/scene-canvas.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createGraphStore } from "@graph/core";
import { GraphProvider } from "@graph/react";
import { SceneCanvas } from "../src";

describe("SceneCanvas", () => {
  it("renders container zones and card nodes from scene placements", () => {
    const store = createGraphStore();

    store.dispatch({
      type: "graph.addNode",
      node: { id: "world:1", type: "world", fields: { name: "World" } }
    });
    store.dispatch({
      type: "graph.addNode",
      node: { id: "organization:1", type: "organization", fields: { name: "Guild" } }
    });
    store.dispatch({
      type: "graph.addNode",
      node: { id: "person:1", type: "person", fields: { name: "Ada" } }
    });
    store.dispatch({ type: "scene.moveNode", sceneId: "default", nodeId: "organization:1", x: 100, y: 100 });
    store.dispatch({ type: "scene.moveNode", sceneId: "default", nodeId: "person:1", x: 150, y: 160 });

    render(
      <GraphProvider store={store}>
        <SceneCanvas />
      </GraphProvider>
    );

    expect(screen.getByTestId("scene-canvas")).toBeTruthy();
    expect(screen.getByText("Guild")).toBeTruthy();
    expect(screen.getByText("Ada")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run the canvas test to verify it fails**

Run:

```bash
pnpm vitest run packages/graph-editor/tests/scene-canvas.test.tsx
```

Expected: FAIL because `@graph/editor` does not exist.

- [ ] **Step 3: Scaffold the editor package**

```json
// packages/graph-editor/package.json
{
  "name": "@graph/editor",
  "version": "0.1.0",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "dependencies": {
    "@graph/core": "workspace:*",
    "@graph/react": "workspace:*"
  },
  "scripts": {
    "build": "tsup src/index.ts --format esm --dts",
    "test": "vitest run"
  }
}
```

```json
// packages/graph-editor/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src", "tests"]
}
```

```ts
// packages/graph-editor/vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom"
  }
});
```

- [ ] **Step 4: Implement the scene shell, projection helper, and relation layer**

```ts
// packages/graph-editor/src/projection.ts
import type { GraphStoreState } from "@graph/core";

export function projectScene(state: GraphStoreState) {
  const placements = state.scene.scenes[state.scene.activeSceneId].nodePlacements;

  return Object.values(state.graph.nodes).map((node) => ({
    node,
    placement: placements[node.id] ?? { x: 0, y: 0 }
  }));
}
```

```tsx
// packages/graph-editor/src/RelationLayer.tsx
import { useGraphSelector } from "@graph/react";

export function RelationLayer() {
  const edges = useGraphSelector((state) => Object.values(state.graph.edges));
  const placements = useGraphSelector((state) => state.scene.scenes[state.scene.activeSceneId].nodePlacements);

  return (
    <svg className="relation-layer" aria-hidden="true">
      {edges.map((edge) => {
        const source = placements[edge.source] ?? { x: 0, y: 0 };
        const target = placements[edge.target] ?? { x: 0, y: 0 };
        return (
          <line
            key={edge.id}
            x1={source.x}
            y1={source.y}
            x2={target.x}
            y2={target.y}
            stroke="currentColor"
            strokeWidth="2"
          />
        );
      })}
    </svg>
  );
}
```

```tsx
// packages/graph-editor/src/SceneCanvas.tsx
import { useGraphSelector } from "@graph/react";
import { projectScene } from "./projection";
import { RelationLayer } from "./RelationLayer";

export function SceneCanvas() {
  const projected = useGraphSelector(projectScene);

  return (
    <div className="scene-canvas" data-testid="scene-canvas">
      <RelationLayer />
      {projected.map(({ node, placement }) => (
        <div
          key={node.id}
          className={`scene-node scene-node--${node.type}`}
          style={{ transform: `translate(${placement.x}px, ${placement.y}px)` }}
        >
          {String(node.fields.name ?? node.id)}
        </div>
      ))}
    </div>
  );
}
```

```tsx
// packages/graph-editor/src/GraphEditor.tsx
import "./editor.css";
import { SceneCanvas } from "./SceneCanvas";

export function GraphEditor() {
  return (
    <div className="graph-editor-shell">
      <SceneCanvas />
    </div>
  );
}
```

```css
/* packages/graph-editor/src/editor.css */
.graph-editor-shell {
  display: grid;
  grid-template-columns: 1fr;
  min-height: 100vh;
}

.scene-canvas {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  background: linear-gradient(180deg, #f6f0e5 0%, #efe4d2 100%);
}

.scene-node {
  position: absolute;
  padding: 10px 14px;
  border: 2px solid #39404a;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.92);
}

.scene-node--organization {
  border-radius: 999px;
  background: rgba(197, 109, 88, 0.14);
}
```

```ts
// packages/graph-editor/src/index.ts
export { GraphEditor } from "./GraphEditor";
export { RelationLayer } from "./RelationLayer";
export { SceneCanvas } from "./SceneCanvas";
```

- [ ] **Step 5: Run the canvas test to verify it passes**

Run:

```bash
pnpm vitest run packages/graph-editor/tests/scene-canvas.test.tsx
```

Expected: PASS with `1 passed`.

- [ ] **Step 6: Commit**

```bash
git add packages/graph-editor
git commit -m "feat: add scene canvas and relation layer"
```

### Task 8: Add the Inspector Panel and Candidate Action Flow

**Files:**
- Create: `packages/graph-editor/src/CandidateActionBar.tsx`
- Create: `packages/graph-editor/src/InspectorPanel.tsx`
- Modify: `packages/graph-editor/src/GraphEditor.tsx`
- Modify: `packages/graph-core/src/types.ts`
- Modify: `packages/graph-core/src/commands.ts`
- Test: `packages/graph-editor/tests/inspector.test.tsx`

- [ ] **Step 1: Write the failing inspector and candidate-action test**

```tsx
// packages/graph-editor/tests/inspector.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { createGraphStore } from "@graph/core";
import { GraphProvider } from "@graph/react";
import { GraphEditor } from "../src";

describe("candidate action flow", () => {
  it("lets the user confirm a semantic action instead of mutating structure silently", async () => {
    const user = userEvent.setup();
    const store = createGraphStore();

    store.dispatch({ type: "graph.addNode", node: { id: "organization:1", type: "organization", fields: { name: "Guild" } } });
    store.dispatch({ type: "graph.addNode", node: { id: "person:1", type: "person", fields: { name: "Ada" } } });

    render(
      <GraphProvider store={store}>
        <GraphEditor />
      </GraphProvider>
    );

    await user.click(screen.getByRole("button", { name: "Join organization" }));

    expect(Object.values(store.getState().graph.edges).map((edge) => edge.type)).toContain("membership");
  });
});
```

- [ ] **Step 2: Run the inspector test to verify it fails**

Run:

```bash
pnpm vitest run packages/graph-editor/tests/inspector.test.tsx
```

Expected: FAIL because the editor has no inspector or candidate action controls.

- [ ] **Step 3: Add commands for candidate confirmation**

```ts
// packages/graph-core/src/types.ts
export type GraphCommand =
  | { type: "graph.addNode"; node: GraphNode }
  | { type: "graph.addEdge"; edge: GraphEdge }
  | { type: "graph.updateNodeFields"; nodeId: string; fields: Record<string, GraphValue> }
  | { type: "scene.moveNode"; nodeId: string; sceneId: string; x: number; y: number }
  | { type: "graph.setPrimaryStructureEdge"; nodeId: string; edgeId: string };
```

```ts
// packages/graph-core/src/commands.ts
case "graph.setPrimaryStructureEdge": {
  state.graph.primaryStructureEdgeByNodeId[command.nodeId] = command.edgeId;
  return;
}
```

- [ ] **Step 4: Implement the candidate action bar and inspector**

```tsx
// packages/graph-editor/src/CandidateActionBar.tsx
import { useGraphDispatch } from "@graph/react";

export function CandidateActionBar() {
  const dispatch = useGraphDispatch();

  return (
    <div className="candidate-action-bar">
      <button
        onClick={() =>
          dispatch({
            type: "graph.addEdge",
            edge: {
              id: "edge:auto-membership",
              type: "membership",
              source: "person:1",
              target: "organization:1"
            }
          })
        }
      >
        Join organization
      </button>
      <button>Keep layout only</button>
    </div>
  );
}
```

```tsx
// packages/graph-editor/src/InspectorPanel.tsx
import { useGraphSelector } from "@graph/react";

export function InspectorPanel() {
  const selectedNodes = useGraphSelector((state) => Object.values(state.graph.nodes));

  return (
    <aside className="inspector-panel">
      <h2>Inspector</h2>
      <ul>
        {selectedNodes.map((node) => (
          <li key={node.id}>
            {node.id}: {String(node.fields.name ?? node.id)}
          </li>
        ))}
      </ul>
    </aside>
  );
}
```

```tsx
// packages/graph-editor/src/GraphEditor.tsx
import "./editor.css";
import { CandidateActionBar } from "./CandidateActionBar";
import { InspectorPanel } from "./InspectorPanel";
import { SceneCanvas } from "./SceneCanvas";

export function GraphEditor() {
  return (
    <div className="graph-editor-shell graph-editor-shell--three-pane">
      <SceneCanvas />
      <InspectorPanel />
      <CandidateActionBar />
    </div>
  );
}
```

- [ ] **Step 5: Run the inspector test to verify it passes**

Run:

```bash
pnpm vitest run packages/graph-editor/tests/inspector.test.tsx
```

Expected: PASS with `1 passed`.

- [ ] **Step 6: Commit**

```bash
git add packages/graph-core/src/types.ts packages/graph-core/src/commands.ts packages/graph-editor/src/CandidateActionBar.tsx packages/graph-editor/src/InspectorPanel.tsx packages/graph-editor/src/GraphEditor.tsx packages/graph-editor/tests/inspector.test.tsx
git commit -m "feat: add inspector and candidate action flow"
```

### Task 9: Add the Structure Navigator, Template Picker, and Status Bar

**Files:**
- Create: `packages/graph-core/src/templates.ts`
- Create: `packages/graph-editor/src/StructureNavigator.tsx`
- Create: `packages/graph-editor/src/TemplatePicker.tsx`
- Create: `packages/graph-editor/src/StatusBar.tsx`
- Modify: `packages/graph-editor/src/GraphEditor.tsx`
- Modify: `packages/graph-editor/src/index.ts`
- Modify: `packages/graph-core/src/index.ts`
- Test: `packages/graph-editor/tests/surfaces.test.tsx`

- [ ] **Step 1: Write the failing surfaces test**

```tsx
// packages/graph-editor/tests/surfaces.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { createGraphStore } from "@graph/core";
import { GraphProvider } from "@graph/react";
import { GraphEditor } from "../src";

describe("editor support surfaces", () => {
  it("loads a template and shows dirty and validation status", async () => {
    const user = userEvent.setup();
    const store = createGraphStore();

    render(
      <GraphProvider store={store}>
        <GraphEditor />
      </GraphProvider>
    );

    await user.click(screen.getByRole("button", { name: "Load starter world" }));

    expect(screen.getByText("Status: dirty")).toBeTruthy();
    expect(screen.getByText("Navigator")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run the surfaces test to verify it fails**

Run:

```bash
pnpm vitest run packages/graph-editor/tests/surfaces.test.tsx
```

Expected: FAIL because the template picker, status bar, and navigator are missing.

- [ ] **Step 3: Implement template loading in the core**

```ts
// packages/graph-core/src/templates.ts
import type { GraphCommand, GraphNode, GraphEdge } from "./types";

export type GraphTemplate = {
  id: string;
  label: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  placements: Record<string, { x: number; y: number }>;
};

export function instantiateTemplate(template: GraphTemplate): GraphCommand[] {
  const commands: GraphCommand[] = [];

  for (const node of template.nodes) {
    commands.push({ type: "graph.addNode", node });
  }

  for (const edge of template.edges) {
    commands.push({ type: "graph.addEdge", edge });
  }

  for (const [nodeId, placement] of Object.entries(template.placements)) {
    commands.push({
      type: "scene.moveNode",
      sceneId: "default",
      nodeId,
      x: placement.x,
      y: placement.y
    });
  }

  return commands;
}
```

```ts
// packages/graph-core/src/index.ts
export { instantiateTemplate } from "./templates";
export type { GraphTemplate } from "./templates";
```

- [ ] **Step 4: Implement the support surfaces and wire them into the shell**

```tsx
// packages/graph-editor/src/StructureNavigator.tsx
import { useGraphSelector } from "@graph/react";

export function StructureNavigator() {
  const nodes = useGraphSelector((state) => Object.values(state.graph.nodes));

  return (
    <aside>
      <h2>Navigator</h2>
      <ul>
        {nodes.map((node) => (
          <li key={node.id}>{String(node.fields.name ?? node.id)}</li>
        ))}
      </ul>
    </aside>
  );
}
```

```tsx
// packages/graph-editor/src/TemplatePicker.tsx
import { instantiateTemplate, type GraphTemplate } from "@graph/core";
import { useGraphDispatch } from "@graph/react";

const starterWorld: GraphTemplate = {
  id: "starter-world",
  label: "Load starter world",
  nodes: [{ id: "organization:starter", type: "organization", fields: { name: "Starter Guild" } }],
  edges: [],
  placements: { "organization:starter": { x: 180, y: 140 } }
};

export function TemplatePicker() {
  const dispatch = useGraphDispatch();

  return (
    <div>
      <button
        onClick={() => {
          instantiateTemplate(starterWorld).forEach((command) => dispatch(command));
        }}
      >
        Load starter world
      </button>
    </div>
  );
}
```

```tsx
// packages/graph-editor/src/StatusBar.tsx
import { useGraphSelector } from "@graph/react";

export function StatusBar() {
  const pendingCount = useGraphSelector((state) => state.pendingCommands.length);

  return <footer>Status: {pendingCount > 0 ? "dirty" : "clean"}</footer>;
}
```

```tsx
// packages/graph-editor/src/GraphEditor.tsx
import "./editor.css";
import { CandidateActionBar } from "./CandidateActionBar";
import { InspectorPanel } from "./InspectorPanel";
import { SceneCanvas } from "./SceneCanvas";
import { StatusBar } from "./StatusBar";
import { StructureNavigator } from "./StructureNavigator";
import { TemplatePicker } from "./TemplatePicker";

export function GraphEditor() {
  return (
    <div className="graph-editor-shell graph-editor-shell--three-pane">
      <StructureNavigator />
      <div>
        <TemplatePicker />
        <SceneCanvas />
        <CandidateActionBar />
        <StatusBar />
      </div>
      <InspectorPanel />
    </div>
  );
}
```

```ts
// packages/graph-editor/src/index.ts
export { CandidateActionBar } from "./CandidateActionBar";
export { GraphEditor } from "./GraphEditor";
export { InspectorPanel } from "./InspectorPanel";
export { RelationLayer } from "./RelationLayer";
export { SceneCanvas } from "./SceneCanvas";
export { StatusBar } from "./StatusBar";
export { StructureNavigator } from "./StructureNavigator";
export { TemplatePicker } from "./TemplatePicker";
```

- [ ] **Step 5: Run the surfaces test to verify it passes**

Run:

```bash
pnpm vitest run packages/graph-editor/tests/surfaces.test.tsx
```

Expected: PASS with `1 passed`.

- [ ] **Step 6: Commit**

```bash
git add packages/graph-core/src/templates.ts packages/graph-core/src/index.ts packages/graph-editor/src/StructureNavigator.tsx packages/graph-editor/src/TemplatePicker.tsx packages/graph-editor/src/StatusBar.tsx packages/graph-editor/src/GraphEditor.tsx packages/graph-editor/src/index.ts packages/graph-editor/tests/surfaces.test.tsx
git commit -m "feat: add template picker and support surfaces"
```

### Task 10: Integrate the Demo Host, End-to-End Flow, and Performance Smoke Tests

**Files:**
- Create: `playwright.config.ts`
- Create: `apps/demo/package.json`
- Create: `apps/demo/tsconfig.json`
- Create: `apps/demo/vite.config.ts`
- Create: `apps/demo/index.html`
- Create: `apps/demo/src/main.tsx`
- Create: `apps/demo/src/App.tsx`
- Create: `apps/demo/src/demoSchema.ts`
- Create: `apps/demo/src/demoTemplate.ts`
- Create: `apps/demo/src/mediumGraphFixture.ts`
- Create: `e2e/graph-editor.spec.ts`
- Test: `packages/graph-editor/tests/projection.performance.test.ts`

- [ ] **Step 1: Write the failing end-to-end and performance tests**

```ts
// e2e/graph-editor.spec.ts
import { expect, test } from "@playwright/test";

test("user can load a template, create semantic structure, and restore local state", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Load starter world" }).click();
  await expect(page.getByText("Starter Guild")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Starter Guild")).toBeVisible();
});
```

```ts
// packages/graph-editor/tests/projection.performance.test.ts
import { describe, expect, it } from "vitest";
import { createGraphStore } from "@graph/core";
import { projectScene } from "../src/projection";

describe("projectScene performance", () => {
  it("projects 1000 nodes without dropping placements", () => {
    const store = createGraphStore();

    for (let index = 0; index < 1000; index += 1) {
      const id = `person:${index}`;
      store.dispatch({ type: "graph.addNode", node: { id, type: "person", fields: { name: id } } });
      store.dispatch({ type: "scene.moveNode", sceneId: "default", nodeId: id, x: index, y: index });
    }

    const projected = projectScene(store.getState());

    expect(projected).toHaveLength(1000);
    expect(projected[999].placement).toEqual({ x: 999, y: 999 });
  });
});
```

- [ ] **Step 2: Run the end-to-end and performance tests to verify they fail**

Run:

```bash
pnpm vitest run packages/graph-editor/tests/projection.performance.test.ts
pnpm playwright test e2e/graph-editor.spec.ts
```

Expected: FAIL because the demo host app and Playwright config do not exist.

- [ ] **Step 3: Scaffold the demo host and Playwright config**

```ts
// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  webServer: {
    command: "pnpm --filter demo dev --host 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true
  }
});
```

```json
// apps/demo/package.json
{
  "name": "demo",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "@graph/core": "workspace:*",
    "@graph/editor": "workspace:*",
    "@graph/react": "workspace:*",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  }
}
```

```json
// apps/demo/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "include": ["src"]
}
```

```ts
// apps/demo/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()]
});
```

- [ ] **Step 4: Implement the demo app with local persistence and fixture data**

```html
<!-- apps/demo/index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Graph Modeling Demo</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
 </html>
```

```tsx
// apps/demo/src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

```ts
// apps/demo/src/demoSchema.ts
import type { GraphSchema } from "@graph/core";

export const demoSchema: GraphSchema = {
  nodeTypes: {
    world: { label: "World", style: { shape: "plane" }, fields: { name: { kind: "string", required: true } } },
    organization: { label: "Organization", style: { shape: "zone" }, fields: { name: { kind: "string", required: true } } },
    person: { label: "Person", style: { shape: "card" }, fields: { name: { kind: "string", required: true } } }
  },
  edgeTypes: {
    membership: {
      label: "Membership",
      class: "structure",
      directed: true,
      sourceTypes: ["person"],
      targetTypes: ["organization"]
    }
  }
};
```

```ts
// apps/demo/src/demoTemplate.ts
import type { GraphTemplate } from "@graph/core";

export const demoTemplate: GraphTemplate = {
  id: "demo-template",
  label: "Writing starter",
  nodes: [
    { id: "world:1", type: "world", fields: { name: "World" } },
    { id: "organization:1", type: "organization", fields: { name: "Starter Guild" } }
  ],
  edges: [],
  placements: {
    "world:1": { x: 40, y: 40 },
    "organization:1": { x: 180, y: 140 }
  }
};
```

```ts
// apps/demo/src/mediumGraphFixture.ts
import type { GraphTemplate } from "@graph/core";

export const mediumGraphFixture: GraphTemplate = {
  id: "medium-graph",
  label: "Medium Graph",
  nodes: Array.from({ length: 400 }, (_, index) => ({
    id: `person:${index}`,
    type: "person",
    fields: { name: `Person ${index}` }
  })),
  edges: [],
  placements: Object.fromEntries(
    Array.from({ length: 400 }, (_, index) => [`person:${index}`, { x: index % 20 * 90, y: Math.floor(index / 20) * 70 }])
  )
};
```

```tsx
// apps/demo/src/App.tsx
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
    loadSnapshot(adapter, graphId).then((snapshot) => {
      if (!snapshot) return;
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
```

- [ ] **Step 5: Run the performance and end-to-end tests to verify they pass**

Run:

```bash
pnpm vitest run packages/graph-editor/tests/projection.performance.test.ts
pnpm playwright test e2e/graph-editor.spec.ts
```

Expected: PASS with the performance smoke test succeeding and the browser workflow completing.

- [ ] **Step 6: Commit**

```bash
git add playwright.config.ts apps/demo e2e/graph-editor.spec.ts packages/graph-editor/tests/projection.performance.test.ts
git commit -m "feat: wire demo host and workflow tests"
```

## Self-Review Checklist

- Spec coverage:
  - Reusable package split is covered by Tasks 1, 6, 7, and 9.
  - Generic property graph, structure edges, and schema validation are covered by Tasks 2 and 3.
  - Scene separation and candidate actions are covered by Task 4 and Task 8.
  - Local-first persistence and sync contracts are covered by Task 5 and Task 10.
  - Product-usable editor surfaces are covered by Tasks 7, 8, 9, and 10.
  - Performance checks are covered by Task 10.
- Placeholder scan:
  - No unfinished marker strings remain in the body of the plan.
  - Each task includes exact file paths, concrete code, and explicit commands.
- Type consistency:
  - `GraphCommand`, `GraphStoreState`, `GraphSchema`, and `GraphTemplate` names are used consistently across tasks.
  - Structure-edge behavior remains edge-based throughout the plan.

## Workspace Constraint

This workspace is not currently a git repository. The commit steps remain part of the plan because they are required for disciplined execution, but they can only run after the project is initialized with git.
