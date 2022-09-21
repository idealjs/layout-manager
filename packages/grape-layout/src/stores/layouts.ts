import { ILayoutNode } from "@idealjs/layout-manager";
import { useMemo } from "react";
import { useSnapshot } from "valtio";

import state from "./state";

export const useLayouts = () => {
    const snapshot = useSnapshot(state);
    return snapshot.layouts;
};

export const useLayout = (nodeId: string) => {
    const snapshot = useSnapshot(state);
    return useMemo(
        () => snapshot.layouts.find((layout) => layout.id === nodeId),
        [nodeId, snapshot.layouts]
    );
};

export const setAllLayouts = (layouts: ILayoutNode[]) => {
    state.layouts = layouts;
};