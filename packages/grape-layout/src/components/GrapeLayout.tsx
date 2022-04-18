import {
    CMPTFactory,
    LayoutNode,
    Provider,
    useStateRef,
} from "@idealjs/layout-manager";
import { PropsWithChildren, useState } from "react";

import CustomSplitter from "./CustomSplitter";
import CustomTab from "./CustomTab";
import CustomTitlebar from "./CustomTitlebar";
import MainLayoutSymbolProvider from "./MainLayoutSymbolProvider";
import PopinListener from "./PopinListener";
import PopoutManager, { IPortal, PortalsProvider } from "./PopoutManager";

interface IProps {
    factory: CMPTFactory;
    layout: LayoutNode;
}

const GrapeLayout = (props: PropsWithChildren<IProps>) => {
    const { children, factory, layout } = props;
    const [portalsRef, portals, setPortals] = useStateRef<IPortal[]>([]);
    const [mainLayoutSymbol] = useState("mainLayout");
    return (
        <MainLayoutSymbolProvider mainLayoutSymbol={mainLayoutSymbol}>
            <PortalsProvider
                portalsRef={portalsRef}
                portals={portals}
                setPortals={setPortals}
            >
                <div style={{ height: "100%", width: "100%" }}>
                    <Provider
                        layoutSymbol={mainLayoutSymbol}
                        layoutNode={layout}
                        factory={factory}
                        Tab={CustomTab}
                        Titlebar={CustomTitlebar}
                        Splitter={CustomSplitter}
                        splitterThickness={4}
                        titlebarHeight={24}
                    >
                        {children}
                        <PopinListener />
                    </Provider>
                </div>
                <PopoutManager
                    factory={factory}
                    Tab={CustomTab}
                    Titlebar={CustomTitlebar}
                    Splitter={CustomSplitter}
                    splitterThickness={4}
                    titlebarHeight={24}
                >
                    {children}
                </PopoutManager>
            </PortalsProvider>
        </MainLayoutSymbolProvider>
    );
};

export default GrapeLayout;
