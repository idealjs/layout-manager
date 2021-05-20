import {
    Layout,
    Provider,
    LayoutNode,
    ILayoutJSON,
} from "@idealjs/layout-manager";
import { FC, useCallback } from "react";
import Portal from "./Portal";
import layoutJSON from "./layout.json";
import { useMemo } from "react";
import CustomTab from "./CustomTab";
import { usePortals } from "./PopoutManager";

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

    return (
        <Provider
            layoutNode={ROOT}
            layoutSymbol={portalId}
            Tab={CustomTab}
            factory={() => () => <div>test</div>}
            updateHook={updateHook}
        >
            <Portal id={portalId}>
                <Layout />
            </Portal>
        </Provider>
    );
};

export default Popout;
