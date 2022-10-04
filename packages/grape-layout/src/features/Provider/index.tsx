import { LayoutNode, UPDATE_HOOK } from "@idealjs/layout-manager";
import { createContext, FC, FunctionComponent, useContext } from "react";

import LayoutNodeProvider from "./LayoutNodeProvider";
import LayoutSymbolProvider from "./LayoutSymbolProvider";
import UpdateHookProvider from "./UpdateHookProvider";
import ValtioStateProvider from "./ValtioStateProvider";

export type CMPTFactory = (
    page: string,
    data?: any
) => FunctionComponent<React.PropsWithChildren<{ nodeData: any }>>;

export interface ILayoutProviderProps {
    factory: CMPTFactory;
    titlebarHeight: number;
    splitterThickness: number;
}

const CMPTContext = createContext<ILayoutProviderProps | null>(null);

const Provider: FC<
    React.PropsWithChildren<
        {
            layoutSymbol?: string | number;
            layoutNode: LayoutNode;
            updateHook?: UPDATE_HOOK;
        } & Partial<ILayoutProviderProps>
    >
> = (props) => {
    const {
        children,
        layoutSymbol,
        layoutNode,
        updateHook,
        factory,
        titlebarHeight,
        splitterThickness,
    } = props;

    return (
        <UpdateHookProvider hook={updateHook}>
            <LayoutNodeProvider layoutNode={layoutNode}>
                <CMPTContext.Provider
                    value={{
                        factory: factory ?? (() => () => null),
                        titlebarHeight: titlebarHeight ?? 24,
                        splitterThickness: splitterThickness ?? 4,
                    }}
                >
                    <LayoutSymbolProvider uniqueSymbol={layoutSymbol}>
                        <ValtioStateProvider>{children}</ValtioStateProvider>
                    </LayoutSymbolProvider>
                </CMPTContext.Provider>
            </LayoutNodeProvider>
        </UpdateHookProvider>
    );
};

export const useFactory = (): CMPTFactory => {
    const content = useContext(CMPTContext);
    if (content == null) {
        throw new Error("hook should work in provider");
    }
    return content.factory;
};

export const useTitlebarHeight = (): number => {
    const content = useContext(CMPTContext);
    if (content == null) {
        throw new Error("hook should work in provider");
    }
    return content.titlebarHeight;
};

export const useSplitterThickness = (): number => {
    const content = useContext(CMPTContext);
    if (content == null) {
        throw new Error("hook should work in provider");
    }
    return content.splitterThickness;
};

export default Provider;
