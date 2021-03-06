import {
    ILayoutJSON,
    Layout,
    LayoutNode,
    Provider,
} from "@idealjs/layout-manager";
import { FC, useCallback } from "react";
import { useMemo } from "react";

import CustomSplitter from "./CustomSplitter";
import CustomTab from "./CustomTab";
import CustomTitlebar from "./CustomTitlebar";
import { useFactory } from "./FactoryProvider";
import layoutJSON from "./layout.json";
import { usePortals } from "./PopoutManager";
import Portal from "./Portal";

const Popout: FC<{ portalId: string | number }> = (props) => {
    const { portalId } = props;

    const { portalsRef, setPortals } = usePortals();

    const ROOT = useMemo(
        () =>
            new LayoutNode({
                layoutJSON: layoutJSON as ILayoutJSON,
            }),
        []
    );

    const afterUpdate = useCallback(
        (layoutSymbol: string | number, layoutNode: LayoutNode) => {
            const inPopout = portalsRef.current.includes(layoutSymbol);
            if (inPopout) {
                if (layoutNode.layoutNodes.length === 0) {
                    console.log("[Debug] closing popout", layoutSymbol);
                    setPortals((s) => s.filter((s) => s !== layoutSymbol));
                }
            }
        },
        [portalsRef, setPortals]
    );
    const updateHook = useMemo(
        () => ({
            after: afterUpdate,
        }),
        [afterUpdate]
    );
    const factory = useFactory();
    return (
        <Provider
            layoutNode={ROOT}
            layoutSymbol={portalId}
            factory={factory}
            Tab={CustomTab}
            Titlebar={CustomTitlebar}
            Splitter={CustomSplitter}
            updateHook={updateHook}
            splitterThickness={5}
            titlebarHeight={30}
        >
            <Portal id={portalId}>
                <Layout />
            </Portal>
        </Provider>
    );
};

export default Popout;
