import { AnyAction, EntityState } from "@reduxjs/toolkit";
import { createContext, FC, useContext, useEffect, useReducer } from "react";

import { selectAll, selectById, setAll } from "../../reducer/panels";
import reducer, { adapter } from "../../reducer/panels";
import { IPanelNode } from "../../reducer/type";

const context = createContext<
    [EntityState<IPanelNode>, React.Dispatch<AnyAction>] | null
>(null);
const PanelsProvider: FC<{ value: IPanelNode[] }> = (props) => {
    const { children, value } = props;
    const [panels, dispatch] = useReducer(reducer, adapter.getInitialState());
    useEffect(() => {
        dispatch(setAll(value));
    }, [value]);
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
