import { useNode } from "../component/Provider";
import { MASK_PART } from "../component/Widget";
import moveNode from "../lib/moveNode";
import shakeTree from "../lib/shakeTree";
import { selectAll, setAll } from "../reducer/nodes";

const rootId = "root";

const useMoveNode = () => {
    const [nodes, dispatch] = useNode();
    return (searchNodeId: string, moveNodeId: string, part: MASK_PART) => {
        let nextState = moveNode(nodes, searchNodeId, moveNodeId, part);
        nextState = shakeTree(nextState, rootId);
        dispatch(setAll(selectAll(nextState)));
    };
};

export default useMoveNode;
