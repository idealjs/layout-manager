import { useNode } from "../component/Provider";
import { ROOTID } from "../constant";
import removeNode from "../lib/removeNode";
import shakeTree from "../lib/shakeTree";
import { selectAll, setAll } from "../reducer/nodes";

const useRemoveNode = () => {
    const [nodes, dispatch] = useNode();
    return (nodeId: string, keepOffset = true) => {
        let nextState = removeNode(nodes, nodeId, keepOffset);
        nextState = shakeTree(nextState, ROOTID);
        dispatch(setAll(selectAll(nextState)));
    };
};

export default useRemoveNode;
