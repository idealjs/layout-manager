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
    const { children, layoutSymbol, layoutNode, updateHook, factory } = props;

    return (
        <UpdateHookProvider hook={updateHook}>
            <LayoutNodeProvider layoutNode={layoutNode}>
                <CMPTContext.Provider
                    value={{
                        factory: factory ?? (() => () => null),
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

export default Provider;

export * from "./LayoutNodeProvider";
export { default as LayoutNodeProvider } from "./LayoutNodeProvider";
export * from "./LayoutSymbolProvider";
export { default as LayoutSymbolProvider } from "./LayoutSymbolProvider";
export * from "./UpdateHookProvider";
export { default as UpdateHookProvider } from "./UpdateHookProvider";
export * from "./ValtioStateProvider";
export { default as ValtioStateProvider } from "./ValtioStateProvider";
