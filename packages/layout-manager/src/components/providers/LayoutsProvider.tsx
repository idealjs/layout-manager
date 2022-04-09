import { AnyAction, EntityState } from "@idealjs/entity";
import { createContext, FC, useContext, useReducer } from "react";

import { selectAll, selectById } from "../../reducers/layouts";
import reducer, { adapter } from "../../reducers/layouts";
import { ILayoutNode } from "../../type";

const context = createContext<
    [EntityState<ILayoutNode>, React.Dispatch<AnyAction>] | null
>(null);
const LayoutsProvider: FC<React.PropsWithChildren<unknown>> = (props) => {
    const { children } = props;
    const [layouts, dispatch] = useReducer(reducer, adapter.getInitialState());
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
