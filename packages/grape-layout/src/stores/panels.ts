import { IPanelNode } from "@idealjs/layout-manager";
import { useMemo } from "react";
import { useSnapshot } from "valtio";

import state from "./state";

export const usePanels = () => {
    const snapshot = useSnapshot(state);
    return snapshot.panels;
};

export const usePanel = (nodeId: string) => {
    const snapshot = useSnapshot(state);
    return useMemo(
        () => snapshot.panels.find((panel) => panel.id === nodeId),
        [nodeId, snapshot.panels]
    );
};

export const setAllPanels = (panels: IPanelNode[]) => {
    state.panels = panels;
};
