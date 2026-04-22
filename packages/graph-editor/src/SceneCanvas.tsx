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
