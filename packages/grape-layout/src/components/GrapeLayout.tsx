import { useState } from "react";
import MainLayoutSymbolProvider from "./MainLayoutSymbolProvider";
import PopoutManager, { PortalsProvider } from "./PopoutManager";
import {
    Provider,
    useStateRef,
    Layout,
    CMPTFactory,
    LayoutNode,
} from "@idealjs/layout-manager";
import PopinListener from "./PopinListener";
import CustomTab from "./CustomTab";
import FactoryProvider from "./FactoryProvider";
import CustomTitlebar from "./CustomTitlebar";
import CustomSplitter from "./CustomSplitter";

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
                <div className="App" style={{ height: "100%", width: "100%" }}>
                    <Provider
                        layoutSymbol={mainLayoutSymbol}
                        factory={factory}
                        Tab={CustomTab}
                        Titlebar={CustomTitlebar}
                        Splitter={CustomSplitter}
                        layoutNode={layout}
                        splitterThickness={5}
                        titlebarHeight={30}
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
