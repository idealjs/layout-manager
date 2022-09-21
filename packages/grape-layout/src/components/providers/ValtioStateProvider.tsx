import {
    ILayoutNode,
    IPanelNode,
    ISplitterNode,
} from "@idealjs/layout-manager";
import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useRef,
} from "react";
import { proxy } from "valtio";

const context = createContext(
    proxy({
        layouts: [] as ILayoutNode[],
        panels: [] as IPanelNode[],
        splitters: [] as ISplitterNode[],
    })
);

const ValtioStateProvider = (props: PropsWithChildren<{}>) => {
    const { children } = props;
    const state = useRef(
        proxy({
            layouts: [] as ILayoutNode[],
            panels: [] as IPanelNode[],
            splitters: [] as ISplitterNode[],
        })
    ).current;

    return <context.Provider value={state}>{children}</context.Provider>;
};

export default ValtioStateProvider;

export const useValtioState = () => {
    return useContext(context);
};
