import { useNode } from "../component/Provider";
import addNode, { ADD_RULE } from "../lib/addNode";
import shakeTree from "../lib/shakeTree";
import { IPanelNode, selectAll, setAll } from "../reducer/nodes";

const rootId = "root";

const useAddNode = () => {
    const [nodes, dispatch] = useNode();
    return (searchNodeId: string, panelNode: IPanelNode, addRule: ADD_RULE) => {
        let nextState = addNode(nodes, searchNodeId, panelNode, addRule);
        nextState = shakeTree(nextState, rootId);
        dispatch(setAll(selectAll(nextState)));
    };
};

export default useAddNode;
