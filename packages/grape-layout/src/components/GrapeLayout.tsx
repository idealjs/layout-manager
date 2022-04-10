import {
    CMPTFactory,
    Layout,
    LayoutNode,
    Provider,
    useStateRef,
} from "@idealjs/layout-manager";
import { useState } from "react";

import CustomSplitter from "./CustomSplitter";
import CustomTab from "./CustomTab";
import CustomTitlebar from "./CustomTitlebar";
import FactoryProvider from "./FactoryProvider";
import MainLayoutSymbolProvider from "./MainLayoutSymbolProvider";
import PopinListener from "./PopinListener";
import PopoutManager, { PortalsProvider } from "./PopoutManager";

const GrapeLayout = (props: { factory: CMPTFactory; layout: LayoutNode }) => {
    const { factory, layout } = props;
    const [portalsRef, portals, setPortals] = useStateRef<(string | number)[]>(
        []
    );
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
                        factory={factory}
                        Tab={CustomTab}
                        Titlebar={CustomTitlebar}
                        Splitter={CustomSplitter}
                        layoutNode={layout}
                    >
                        <Layout />
                        <PopinListener />
                    </Provider>
                </div>
                <FactoryProvider factory={factory}>
                    <PopoutManager />
                </FactoryProvider>
            </PortalsProvider>
        </MainLayoutSymbolProvider>
    );
};

export default GrapeLayout;
