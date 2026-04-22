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
