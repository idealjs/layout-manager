import {
    ILayoutJSON,
    Layout,
    LayoutNode,
    Provider,
} from "@idealjs/layout-manager";
import PortalWindow from "@idealjs/portal-window";
import { FC, useCallback, useRef } from "react";
import { useMemo } from "react";

import CustomSplitter from "./CustomSplitter";
import CustomTab from "./CustomTab";
import CustomTitlebar from "./CustomTitlebar";
import { useFactory } from "./FactoryProvider";
import layoutJSON from "./layout.json";
import { usePortals } from "./PopoutManager";

const Popout: FC<{ portalId: string | number }> = (props) => {
    const { portalId } = props;
    const portalRef = useRef<{ close: () => void }>(null);
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
                console.log(
                    "[Debug] closing popout",
                    layoutNode.layoutNodes.length
                );

                if (layoutNode.layoutNodes.length === 0) {
                    console.log("[Debug] closing popout", layoutSymbol);
                    portalRef.current?.close();
                }
            }
        },
        [portalsRef]
    );

    const updateHook = useMemo(
        () => ({
            after: afterUpdate,
        }),
        [afterUpdate]
    );

    const factory = useFactory();

    const onExtBeforeUnload = useCallback(() => {
        setPortals((state) => state.filter((d) => d !== portalId));
    }, [portalId, setPortals]);

    const onMainBeforeunload = useCallback(() => {
        portalRef.current?.close();
    }, []);

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
            <PortalWindow
                ref={portalRef}
                onExtBeforeUnload={onExtBeforeUnload}
                onMainBeforeUnload={onMainBeforeunload}
            >
                <Layout />
            </PortalWindow>
        </Provider>
    );
};

export default Popout;
