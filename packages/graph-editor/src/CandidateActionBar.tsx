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
      <button type="button">Keep layout only</button>
    </div>
  );
}
