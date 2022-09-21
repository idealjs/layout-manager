import { useSnapshot } from "valtio";

import { ILayoutNode } from "../type";
import state from "./state";

export const useLayouts = () => {
  const snapshot = useSnapshot(state);
  return snapshot.layouts;
};

export const useLayout = (nodeId: string) => {
  const snapshot = useSnapshot(state);
  return snapshot.layouts.find((layout) => layout.id === nodeId);
};

export const setAllLayouts = (layouts: ILayoutNode[]) => {
  state.layouts = layouts;
};
