import { useNode } from "../component/Provider";
import removeNode from "../lib/removeNode";
import shakeTree from "../lib/shakeTree";
import { selectAll, setAll } from "../reducer/nodes";

const rootId = "root";

const useRemoveNode = () => {
    const [nodes, dispatch] = useNode();
    return (nodeId: string, keepOffset = true) => {
        let nextState = removeNode(nodes, nodeId, keepOffset);
        nextState = shakeTree(nextState, rootId);
        dispatch(setAll(selectAll(nextState)));
    };
};

export default useRemoveNode;
