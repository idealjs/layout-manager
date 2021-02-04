import { useNode } from "../component/Provider";
import { ROOTID } from "../constant";
import { ADD_RULE } from "../enum";
import addNode from "../lib/addNode";
import shakeTree from "../lib/shakeTree";
import { IPanelNode, selectAll, setAll } from "../reducer/nodes";

const useAddNode = () => {
    const [nodes, dispatch] = useNode();
    return (searchNodeId: string, panelNode: IPanelNode, addRule: ADD_RULE) => {
        let nextState = addNode(nodes, searchNodeId, panelNode, addRule);
        nextState = shakeTree(nextState, ROOTID);
        dispatch(setAll(selectAll(nextState)));
    };
};

export default useAddNode;
