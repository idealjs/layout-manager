import { useNode } from "../component/Provider";
import { ROOTID } from "../constant";
import addNodeByRules, { IRule } from "../lib/addNodeByRules";
import shakeTree from "../lib/shakeTree";
import { selectAll, setAll } from "../reducer/nodes";

const useAddNodeByRules = () => {
    const [nodes, dispatch] = useNode();
    return async (page: string, rules: IRule[], max: number) => {
        let nextState = await addNodeByRules(nodes, page, rules, max);
        nextState = shakeTree(nextState, ROOTID);
        dispatch(setAll(selectAll(nextState)));
    };
};

export default useAddNodeByRules;
