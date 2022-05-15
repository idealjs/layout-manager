import {
    createEvent,
    createStore,
    useStore,
    useStoreMap,
} from "@idealjs/effector";

import { IPanelNode } from "../type";

const $panels = createStore<IPanelNode[]>([]);

export const $setAllPanels = createEvent<IPanelNode[]>();

$panels.on($setAllPanels, (_, panels) => panels);

export default $panels;

export const usePanels = () => {
    return useStore($panels);
};

export const usePanel = (nodeId: string) => {
    return useStoreMap($panels, (panels) =>
        panels.find((panel) => panel.id === nodeId)
    );
};
