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

    store.dispatch({
      type: "graph.addNode",
      node: { id: "organization:1", type: "organization", fields: { name: "Guild" } }
    });
    store.dispatch({
      type: "graph.addNode",
      node: { id: "person:1", type: "person", fields: { name: "Ada" } }
    });

    render(
      <GraphProvider store={store}>
        <GraphEditor />
      </GraphProvider>
    );

    await user.click(screen.getByRole("button", { name: "Join organization" }));

    expect(Object.values(store.getState().graph.edges).map((edge) => edge.type)).toContain("membership");
  });
});
