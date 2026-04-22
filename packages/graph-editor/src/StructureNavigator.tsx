import { useGraphSelector } from "@graph/react";

export function StructureNavigator() {
  const nodes = useGraphSelector((state) => Object.values(state.graph.nodes));

  return (
    <aside className="structure-navigator">
      <h2>Navigator</h2>
      <ul>
        {nodes.map((node) => (
          <li key={node.id}>{String(node.fields.name ?? node.id)}</li>
        ))}
      </ul>
    </aside>
  );
}
