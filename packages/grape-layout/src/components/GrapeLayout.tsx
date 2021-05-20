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
                <div
                    className="App"
                    style={{ height: "100vh", width: "100vw" }}
                >
                    <Provider
                        layoutSymbol={mainLayoutSymbol}
                        factory={factory}
                        Tab={CustomTab}
                        layoutNode={layout}
                    >
                        <Layout />
                        <PopinListener />
                    </Provider>
                </div>
                <PopoutManager />
            </PortalsProvider>
        </MainLayoutSymbolProvider>
    );
};

export default GrapeLayout;
