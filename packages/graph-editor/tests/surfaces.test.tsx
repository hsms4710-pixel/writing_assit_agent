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
