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
