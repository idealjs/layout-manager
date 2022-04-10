import {
    ILayoutJSON,
    ILayoutProviderProps,
    Layout,
    LayoutNode,
    Provider,
} from "@idealjs/layout-manager";
import PortalWindow from "@idealjs/portal-window";
import { FC, useCallback, useRef } from "react";
import { useMemo } from "react";

import layoutJSON from "./layout.json";
import { usePortals } from "./PopoutManager";

interface IProps extends Partial<ILayoutProviderProps> {
    portalId: string | number;
}

const Popout: FC<React.PropsWithChildren<IProps>> = (props) => {
    const { portalId, ...layoutProviderProps } = props;
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
            updateHook={updateHook}
            {...layoutProviderProps}
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
