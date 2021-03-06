import { useLayouts } from "../component/Provider/LayoutsProvider";
import { usePanels } from "../component/Provider/PanelsProvider";
import { ADD_RULE } from "../enum";
import addNode from "../lib/addNode";
import {
    selectAll as selectAllLayouts,
    setAll as setAllLayouts,
} from "../reducer/layouts";
import {
    selectAll as selectAllPanels,
    setAll as setAllPanels,
} from "../reducer/panels";
import { IPanelNode } from "../reducer/type";

const useAddNode = () => {
    const [, layoutNodes, dispatchLayouts] = useLayouts();
    const [, panelNodes, dispatchPanels] = usePanels();

    return (searchNodeId: string, panelNode: IPanelNode, addRule: ADD_RULE) => {
        let [nextLayoutNodes, nextPanelNodes] = addNode(
            layoutNodes,
            panelNodes,
            searchNodeId,
            panelNode,
            addRule
        );
        dispatchLayouts(setAllLayouts(selectAllLayouts(nextLayoutNodes)));
        dispatchPanels(setAllPanels(selectAllPanels(nextPanelNodes)));
    };
};

export default useAddNode;
