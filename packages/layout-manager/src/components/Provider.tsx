import CustomSplitter from "components/CustomSplitter";
import CustomTab from "components/CustomTab";
import CustomTitlebar from "components/CustomTitlebar";
import LayoutNodeProvider from "components/providers/LayoutNodeProvider";
import LayoutsProvider from "components/providers/LayoutsProvider";
import LayoutSymbolProvider from "components/providers/LayoutSymbolProvider";
import PanelsProvider from "components/providers/PanelsProvider";
import SplittersProvider from "components/providers/SplittersProvider";
import UpdateHookProvider from "components/providers/UpdateHookProvider";
import LayoutNode from "lib/LayoutNode";
import { createContext, FC, FunctionComponent, useContext } from "react";
import { SplitterCMPT, TABCMPT, TitlebarCMPT, UPDATE_HOOK } from "src/type";

export type CMPTFactory = (
    page: string,
    data?: any
) => FunctionComponent<{ nodeData: any }>;

const CMPTContext =
    createContext<{
        factory: CMPTFactory;
        Tab: TABCMPT;
        Titlebar: TitlebarCMPT;
        Splitter: SplitterCMPT;
        titlebarHeight: number;
        splitterThickness: number;
    } | null>(null);

const RIDContext = createContext("RID");

const Provider: FC<{
    factory: CMPTFactory;
    Tab?: TABCMPT;
    Titlebar?: TitlebarCMPT;
    Splitter?: SplitterCMPT;
    RID?: string;
    layoutSymbol?: string | number;
    layoutNode: LayoutNode;
    updateHook?: UPDATE_HOOK;
    titlebarHeight?: number;
    splitterThickness?: number;
}> = (props) => {
    const {
        children,
        factory,
        Tab,
        Titlebar,
        Splitter,
        RID,
        layoutSymbol,
        layoutNode,
        updateHook,
        titlebarHeight,
        splitterThickness,
    } = props;

    return (
        <UpdateHookProvider hook={updateHook}>
            <LayoutNodeProvider layoutNode={layoutNode}>
                <CMPTContext.Provider
                    value={{
                        factory,
                        Tab: Tab ? Tab : CustomTab,
                        Titlebar: Titlebar ? Titlebar : CustomTitlebar,
                        Splitter: Splitter ? Splitter : CustomSplitter,
                        titlebarHeight: titlebarHeight ? titlebarHeight : 25,
                        splitterThickness: splitterThickness
                            ? splitterThickness
                            : 10,
                    }}
                >
                    <LayoutSymbolProvider uniqueSymbol={layoutSymbol}>
                        <LayoutsProvider>
                            <PanelsProvider>
                                <SplittersProvider>
                                    <RIDContext.Provider
                                        value={RID ? RID : "RID"}
                                    >
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
        </UpdateHookProvider>
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

export const useCustomTitlebar = (): TitlebarCMPT => {
    const content = useContext(CMPTContext);
    if (content == null) {
        throw new Error("Tab CMPT not Provide");
    }
    return content.Titlebar;
};

export const useCustomSplitter = (): SplitterCMPT => {
    const content = useContext(CMPTContext);
    if (content == null) {
        throw new Error("Tab CMPT not Provide");
    }
    return content.Splitter;
};

export const useTitlebarHeight = (): number => {
    const content = useContext(CMPTContext);
    if (content == null) {
        throw new Error("Tab CMPT not Provide");
    }
    return content.titlebarHeight;
};

export const useSplitterThickness = (): number => {
    const content = useContext(CMPTContext);
    if (content == null) {
        throw new Error("Tab CMPT not Provide");
    }
    return content.splitterThickness;
};

export default Provider;
