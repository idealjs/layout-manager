import { AnyAction, EntityState } from "@reduxjs/toolkit";
import { createContext, FC, useContext, useReducer } from "react";

import { selectAll, selectById } from "../../reducer/splitters";
import reducer, { adapter } from "../../reducer/splitters";
import { ISplitterNode } from "../../reducer/type";

const context = createContext<
    [EntityState<ISplitterNode>, React.Dispatch<AnyAction>] | null
>(null);
const SplittersProvider: FC = (props) => {
    const { children } = props;

    const [splitters, dispatch] = useReducer(
        reducer,
        adapter.getInitialState()
    );
    return (
        <context.Provider value={[splitters, dispatch]}>
            {children}
        </context.Provider>
    );
};

export const useSplitters = (): [
    ISplitterNode[],
    EntityState<ISplitterNode>,
    React.Dispatch<AnyAction>
] => {
    const contextData = useContext(context);
    if (contextData == null) {
        throw new Error("Empty context");
    }
    const [splitterNodes, dispatch] = contextData;
    const splitters = selectAll(splitterNodes);
    return [splitters, splitterNodes, dispatch];
};

export const useSplitter = (nodeId: string) => {
    const [, splitterNodes] = useSplitters();
    return selectById(splitterNodes, nodeId);
};

export default SplittersProvider;
