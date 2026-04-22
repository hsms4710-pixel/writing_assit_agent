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
    <div className="template-picker">
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
