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
