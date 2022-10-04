import { LayoutNode } from "@idealjs/layout-manager";
import { PropsWithChildren, useState } from "react";

import useStateRef from "../hooks/useStateRef";
import MainLayoutSymbolProvider from "./MainLayoutSymbolProvider";
import PopinListener from "./PopinListener";
import PopoutManager, { IPortal, PortalsProvider } from "./PopoutManager";
import Provider, { CMPTFactory } from "./Provider";

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
                    >
                        {children}
                        <PopinListener />
                    </Provider>
                </div>
                <PopoutManager factory={factory}>{children}</PopoutManager>
            </PortalsProvider>
        </MainLayoutSymbolProvider>
    );
};

export default GrapeLayout;
