import { ROOTID } from "../constant";
import { ADD_RULE } from "../enum";
import addNode from "../lib/addNode";
import shakeTree from "../lib/shakeTree";

const useAddNode = () => {
    // const [nodes, dispatch] = useNodes();
    // return (searchNodeId: string, panelNode: IPanelNode, addRule: ADD_RULE) => {
    //     let nextState = addNode(nodes, searchNodeId, panelNode, addRule);
    //     nextState = shakeTree(nextState, ROOTID);
    //     dispatch(setAll(selectAll(nextState)));
    // };
};

export default useAddNode;
