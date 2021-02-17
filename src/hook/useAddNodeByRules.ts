import { ROOTID } from "../constant";
import addNodeByRules, { IRule } from "../lib/addNodeByRules";
import shakeTree from "../lib/shakeTree";

const useAddNodeByRules = () => {
    return async (page: string, rules: IRule[], max: number, nodeData: any) => {
        // let nextState = await addNodeByRules(nodes, page, rules, max, nodeData);
        // nextState = shakeTree(nextState, ROOTID);
        // dispatch(setAll(selectAll(nextState)));
    };
};

export default useAddNodeByRules;
