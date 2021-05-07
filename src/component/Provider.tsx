import { createContext, FC, FunctionComponent, useContext } from "react";

import LayoutNode from "../lib/LayoutNode";
import { TABCMPT } from "../reducer/type";
import CustomTab from "./CustomTab";
import LayoutNodeProvider from "./Provider/LayoutNodeProvider";
import LayoutsProvider from "./Provider/LayoutsProvider";
import LayoutSymbolProvider from "./Provider/LayoutSymbolProvider";
import PanelsProvider from "./Provider/PanelsProvider";
import SplittersProvider from "./Provider/SplittersProvider";

export type CMPTFactory = (
    page: string,
    data?: any
) => FunctionComponent<{ nodeData: any }>;

const CMPTContext = createContext<{
    factory: CMPTFactory;
    Tab: TABCMPT;
} | null>(null);

const RIDContext = createContext("RID");

const Provider: FC<{
    factory: CMPTFactory;
    Tab?: TABCMPT;
    RID?: string;
    layoutSymbol?: string | number;
    layoutNode: LayoutNode;
}> = (props) => {
    const { children, factory, Tab, RID, layoutSymbol, layoutNode } = props;

    return (
        <LayoutNodeProvider layoutNode={layoutNode}>
            <CMPTContext.Provider
                value={{ factory, Tab: Tab ? Tab : CustomTab }}
            >
                <LayoutSymbolProvider uniqueSymbol={layoutSymbol}>
                    <LayoutsProvider>
                        <PanelsProvider>
                            <SplittersProvider>
                                <RIDContext.Provider value={RID ? RID : "RID"}>
                                    <LayoutsProvider>
                                        {children}
                                    </LayoutsProvider>
                                </RIDContext.Provider>
                            </SplittersProvider>
                        </PanelsProvider>
                    </LayoutsProvider>
                </LayoutSymbolProvider>
            </CMPTContext.Provider>
        </LayoutNodeProvider>
    );
};

export const useFactory = (): CMPTFactory => {
    const content = useContext(CMPTContext);
    if (content == null) {
        throw new Error("CMPT Factory not Provide");
    }
    return content.factory;
};

export const useCustomTab = (): TABCMPT => {
    const content = useContext(CMPTContext);
    if (content == null) {
        throw new Error("Tab CMPT not Provide");
    }
    return content.Tab;
};

export default Provider;
