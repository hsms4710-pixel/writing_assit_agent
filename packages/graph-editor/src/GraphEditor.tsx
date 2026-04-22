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
