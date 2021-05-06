import { createContext, FC, FunctionComponent, useContext } from "react";

import { TABCMPT } from "../reducer/type";
import CustomTab from "./CustomTab";
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
}> = (props) => {
    const { children, factory, Tab, RID, layoutSymbol } = props;

    return (
        <CMPTContext.Provider value={{ factory, Tab: Tab ? Tab : CustomTab }}>
            <LayoutSymbolProvider uniqueSymbol={layoutSymbol}>
                <LayoutsProvider>
                    <PanelsProvider>
                        <SplittersProvider>
                            <RIDContext.Provider value={RID ? RID : "RID"}>
                                <LayoutsProvider>{children}</LayoutsProvider>
                            </RIDContext.Provider>
                        </SplittersProvider>
                    </PanelsProvider>
                </LayoutsProvider>
            </LayoutSymbolProvider>
        </CMPTContext.Provider>
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
