import { AnyAction, EntityState } from "@reduxjs/toolkit";
import { createContext, FC, useContext, useMemo, useReducer } from "react";

import { IWidgetNode } from "../../reducer/type";
import { selectAll, selectById } from "../../reducer/widgets";
import reducer, { adapter } from "../../reducer/widgets";

const context = createContext<
    [EntityState<IWidgetNode>, React.Dispatch<AnyAction>] | null
>(null);
const WidgetsProvider: FC = (props) => {
    const { children } = props;

    const [widgets, dispatch] = useReducer(reducer, adapter.getInitialState());
    return (
        <context.Provider value={[widgets, dispatch]}>
            {children}
        </context.Provider>
    );
};

export const useWidgets = (): [
    IWidgetNode[],
    EntityState<IWidgetNode>,
    React.Dispatch<AnyAction>
] => {
    const contextData = useContext(context);
    if (contextData == null) {
        throw new Error("Empty context");
    }
    const [widgetNodes, dispatch] = contextData;
    const widgets = useMemo(() => selectAll(widgetNodes), [widgetNodes]);
    return [widgets, widgetNodes, dispatch];
};

export const useWidget = (nodeId: string) => {
    const [, widgetNodes] = useWidgets();

    return useMemo(() => selectById(widgetNodes, nodeId), [
        nodeId,
        widgetNodes,
    ]);
};

export default WidgetsProvider;
