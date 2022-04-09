import { AnyAction, EntityState } from "@idealjs/entity";
import { createContext, FC, useContext, useReducer } from "react";

import { selectAll, selectById } from "../../reducers/panels";
import reducer, { adapter } from "../../reducers/panels";
import { IPanelNode } from "../../type";

const context = createContext<
    [EntityState<IPanelNode>, React.Dispatch<AnyAction>] | null
>(null);
const PanelsProvider: FC = (props) => {
    const { children } = props;
    const [panels, dispatch] = useReducer(reducer, adapter.getInitialState());
    return (
        <context.Provider value={[panels, dispatch]}>
            {children}
        </context.Provider>
    );
};

export const usePanels = (): [
    IPanelNode[],
    EntityState<IPanelNode>,
    React.Dispatch<AnyAction>
] => {
    const contextData = useContext(context);
    if (contextData == null) {
        throw new Error("Empty context");
    }
    const [panelNodes, dispatch] = contextData;
    const panels = selectAll(panelNodes);
    return [panels, panelNodes, dispatch];
};

export const usePanel = (nodeId: string) => {
    const [, panelNodes] = usePanels();
    return selectById(panelNodes, nodeId);
};

export default PanelsProvider;
