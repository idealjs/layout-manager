import { ISplitterNode } from "@idealjs/layout-manager";
import { useCallback, useMemo } from "react";
import { useSnapshot } from "valtio";

import { useValtioState } from "../components/providers/ValtioStateProvider";

export const useSplitters = () => {
    const state = useValtioState();
    const snapshot = useSnapshot(state);
    return snapshot.splitters;
};

export const useSplitter = (nodeId: string) => {
    const state = useValtioState();
    const snapshot = useSnapshot(state);
    return useMemo(
        () => snapshot.splitters.find((splitter) => splitter.id === nodeId),
        [nodeId, snapshot.splitters]
    );
};

export const useSetAllSplitters = () => {
    const state = useValtioState();
    return useCallback(
        (splitters: ISplitterNode[]) => {
            state.splitters = splitters;
        },
        [state]
    );
};
