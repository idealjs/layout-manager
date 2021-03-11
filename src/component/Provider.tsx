import { createContext, FC, FunctionComponent, useContext } from "react";

import { IPanelNode, TABCMPT } from "../reducer/type";
import CustomTab from "./CustomTab";
import LayoutsProvider from "./Provider/LayoutsProvider";
import PanelsProvider from "./Provider/PanelsProvider";
import SplittersProvider from "./Provider/SplittersProvider";

export type CMPTFactory = (
    page: string
) => FunctionComponent<{ nodeData: any }>;

const CMPTContext = createContext<{
    factory: CMPTFactory;
    Tab: TABCMPT;
} | null>(null);

const RIDContext = createContext("RID");

const Provider: FC<{
    panels: IPanelNode[];
    factory: CMPTFactory;
    Tab?: TABCMPT;
    RID?: string;
}> = (props) => {
    const { panels, children, factory, Tab, RID } = props;

    return (
        <CMPTContext.Provider value={{ factory, Tab: Tab ? Tab : CustomTab }}>
            <LayoutsProvider>
                <PanelsProvider value={panels}>
                    <SplittersProvider>
                        <RIDContext.Provider value={RID ? RID : "RID"}>
                            {children}
                        </RIDContext.Provider>
                    </SplittersProvider>
                </PanelsProvider>
            </LayoutsProvider>
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

export const useTab = (): TABCMPT => {
    const content = useContext(CMPTContext);
    if (content == null) {
        throw new Error("Tab CMPT not Provide");
    }
    return content.Tab;
};

export default Provider;
