import { ROOTID } from "../constant";
import removeNode from "../lib/removeNode";
import shakeTree from "../lib/shakeTree";

const useRemoveNode = () => {
    return (nodeId: string, keepOffset = true) => {
        // let nextState = removeNode(nodes, nodeId, keepOffset);
        // nextState = shakeTree(nextState, ROOTID);
        // dispatch(setAll(selectAll(nextState)));
    };
};

export default useRemoveNode;
