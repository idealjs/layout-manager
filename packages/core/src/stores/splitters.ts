import { useSnapshot } from "valtio";

import { ISplitterNode } from "../type";
import state from "./state";

export const useSplitters = () => {
  const snapshot = useSnapshot(state);
  return snapshot.splitters;
};

export const useSplitter = (nodeId: string) => {
  const snapshot = useSnapshot(state);
  return snapshot.splitters.find((splitter) => splitter.id === nodeId);
};

export const setAllSplitters = (splitters: ISplitterNode[]) => {
  state.splitters = splitters;
};
