import { useCallback } from "react";

import { useLayouts } from "../component/Provider/LayoutsProvider";
import { usePanels } from "../component/Provider/PanelsProvider";
import { ROOTID } from "../constant";
import shakeTree from "../lib/shakeTree";
import {
    removeChild,
    selectAll as selectAllLayouts,
    setAll as setAllLayouts,
} from "../reducer/layouts";
import {
    removeNode as removePanelNodes,
    selectAll as selectAllPanels,
    selectById as selectPanelsById,
    setAll as setAllPanels,
} from "../reducer/panels";

const useRemoveNode = () => {
    const [, layoutNodes, dispatchLayouts] = useLayouts();
    const [, panelNodes, dispatchPanels] = usePanels();
    return useCallback(
        (nodeId: string) => {
            let nextLayoutNodes = layoutNodes;
            let nextPanelNodes = panelNodes;

            const node = selectPanelsById(nextPanelNodes, nodeId);
            if (node == null) {
                throw new Error("node not found");
            }
            nextPanelNodes = removePanelNodes(nextPanelNodes, nodeId);
            nextLayoutNodes = removeChild(
                nextLayoutNodes,
                node.parentId,
                nodeId
            );
            nextLayoutNodes = shakeTree(nextLayoutNodes, ROOTID);
            console.log(nextLayoutNodes, node.parentId, nodeId);
            dispatchLayouts(setAllLayouts(selectAllLayouts(nextLayoutNodes)));
            dispatchPanels(setAllPanels(selectAllPanels(nextPanelNodes)));
        },
        [dispatchLayouts, dispatchPanels, layoutNodes, panelNodes]
    );
};

export default useRemoveNode;
