import {
    createContext,
    CSSProperties,
    FC,
    FunctionComponent,
    useContext,
} from "react";

import LayoutNode from "../lib/LayoutNode";
import { SplitterCMPT, TABCMPT, TitlebarCMPT, UPDATE_HOOK } from "../type";
import DefaultSplitter from "./DefaultSplitter";
import DefaultTab from "./DefaultTab";
import DefaultTitlebar from "./DefaultTitlebar";
import LayoutNodeProvider from "./providers/LayoutNodeProvider";
import LayoutsProvider from "./providers/LayoutsProvider";
import LayoutSymbolProvider from "./providers/LayoutSymbolProvider";
import PanelsProvider from "./providers/PanelsProvider";
import SplittersProvider from "./providers/SplittersProvider";
import UpdateHookProvider from "./providers/UpdateHookProvider";

export type CMPTFactory = (
    page: string,
    data?: any
) => FunctionComponent<React.PropsWithChildren<{ nodeData: any }>>;

export interface ILayoutProviderProps {
    factory: CMPTFactory;
    Tab: TABCMPT;
    Titlebar: TitlebarCMPT;
    Splitter: SplitterCMPT;
    titlebarHeight: number;
    titlebarStyle: CSSProperties;
    splitterThickness: number;
}

const CMPTContext = createContext<ILayoutProviderProps | null>(null);

const RIDContext = createContext("RID");

const Provider: FC<
    React.PropsWithChildren<
        {
            RID?: string;
            layoutSymbol?: string | number;
            layoutNode: LayoutNode;
            updateHook?: UPDATE_HOOK;
        } & Partial<ILayoutProviderProps>
    >
> = (props) => {
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
        titlebarStyle,
        splitterThickness,
    } = props;

    return (
        <UpdateHookProvider hook={updateHook}>
            <LayoutNodeProvider layoutNode={layoutNode}>
                <CMPTContext.Provider
                    value={{
                        factory: factory ?? (() => () => null),
                        Tab: Tab ?? DefaultTab,
                        Titlebar: Titlebar ?? DefaultTitlebar,
                        Splitter: Splitter ?? DefaultSplitter,
                        titlebarHeight: titlebarHeight ?? 24,
                        titlebarStyle: titlebarStyle ?? {},
                        splitterThickness: splitterThickness ?? 4,
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
