import { useCallback } from "react";

import { useLayouts } from "../component/Provider/LayoutsProvider";
import { usePanels } from "../component/Provider/PanelsProvider";
import { ROOTID } from "../constant";
import { ADD_RULE } from "../enum";
import addNode from "../lib/addNode";
import shakeTree from "../lib/shakeTree";


const useAddNode = () => {
    const [, layoutNodes, dispatchLayouts] = useLayouts();
    const [, panelNodes, dispatchPanels] = usePanels();
    return useCallback(()=>{
        let nextLayoutNodes = layoutNodes;
        let nextPanelNodes = panelNodes;
    },[layoutNodes, panelNodes])
    // const [nodes, dispatch] = useNodes();
    // return (searchNodeId: string, panelNode: IPanelNode, addRule: ADD_RULE) => {
    //     let nextState = addNode(nodes, searchNodeId, panelNode, addRule);
    //     nextState = shakeTree(nextState, ROOTID);
    //     dispatch(setAll(selectAll(nextState)));
    // };
};

export default useAddNode;
