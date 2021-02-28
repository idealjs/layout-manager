import { useCallback } from "react";

import { useLayouts } from "../component/Provider/LayoutsProvider";
import { usePanels } from "../component/Provider/PanelsProvider";
import removeNode from "../lib/removeNode";
import {
    selectAll as selectAllLayouts,
    setAll as setAllLayouts,
} from "../reducer/layouts";
import {
    selectAll as selectAllPanels,
    setAll as setAllPanels,
} from "../reducer/panels";

const useRemoveNode = () => {
    const [, layoutNodes, dispatchLayouts] = useLayouts();
    const [, panelNodes, dispatchPanels] = usePanels();

    return useCallback(
        (nodeId: string) => {
            const [nextLayoutNodes, nextPanelNodes] = removeNode(
                layoutNodes,
                panelNodes,
                nodeId
            );
            dispatchLayouts(setAllLayouts(selectAllLayouts(nextLayoutNodes)));
            dispatchPanels(setAllPanels(selectAllPanels(nextPanelNodes)));
        },
        [dispatchLayouts, dispatchPanels, layoutNodes, panelNodes]
    );
};

export default useRemoveNode;
