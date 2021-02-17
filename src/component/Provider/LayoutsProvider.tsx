import { AnyAction, EntityState } from "@reduxjs/toolkit";
import { createContext, FC, useContext, useEffect, useReducer } from "react";

import { selectAll, selectById, setAll } from "../../reducer/layouts";
import reducer, { adapter } from "../../reducer/layouts";
import { ILayoutNode } from "../../reducer/type";

const context = createContext<
    [EntityState<ILayoutNode>, React.Dispatch<AnyAction>] | null
>(null);
const LayoutsProvider: FC<{ value: ILayoutNode[] }> = (props) => {
    const { children, value } = props;
    const [layouts, dispatch] = useReducer(reducer, adapter.getInitialState());
    useEffect(() => {
        dispatch(setAll(value));
    }, [value]);
    return (
        <context.Provider value={[layouts, dispatch]}>
            {children}
        </context.Provider>
    );
};

export const useLayouts = (): [
    ILayoutNode[],
    EntityState<ILayoutNode>,
    React.Dispatch<AnyAction>
] => {
    const contextData = useContext(context);
    if (contextData == null) {
        throw new Error("Empty context");
    }
    const [layoutNodes, dispatch] = contextData;
    const layouts = selectAll(layoutNodes);
    return [layouts, layoutNodes, dispatch];
};

export const useLayout = (nodeId: string) => {
    const [, layoutNodes] = useLayouts();
    return selectById(layoutNodes, nodeId);
};

export default LayoutsProvider;
