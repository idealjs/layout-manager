import { useNode } from "../component/Provider";
import { MASK_PART } from "../component/Widget";
import { ROOTID } from "../constant";
import moveNode from "../lib/moveNode";
import shakeTree from "../lib/shakeTree";
import { selectAll, setAll } from "../reducer/nodes";

const useMoveNode = () => {
    const [nodes, dispatch] = useNode();
    return (
        searchNodeId: string,
        moveNodeId: string,
        moveNodePage: string,
        part: MASK_PART
    ) => {
        let nextState = moveNode(
            nodes,
            searchNodeId,
            moveNodeId,
            moveNodePage,
            part
        );
        nextState = shakeTree(nextState, ROOTID);
        dispatch(setAll(selectAll(nextState)));
    };
};

export default useMoveNode;
