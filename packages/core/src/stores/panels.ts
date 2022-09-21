import { useSnapshot } from "valtio";

import { IPanelNode } from "../type";
import state from "./state";

export const usePanels = () => {
  const snapshot = useSnapshot(state);
  return snapshot.panels;
};

export const usePanel = (nodeId: string) => {
  const snapshot = useSnapshot(state);
  return snapshot.panels.find((panel) => panel.id === nodeId);
};

export const setAllPanels = (panels: IPanelNode[]) => {
  state.panels = panels;
};
