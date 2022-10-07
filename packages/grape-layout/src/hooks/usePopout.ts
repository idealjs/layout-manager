import { IPoint } from "@idealjs/dnd-react";
import {
    ADD_PANEL_DATA,
    LayoutNodeActionType,
    MASK_PART,
    PanelNode,
    REMOVE_PANEL_DATA,
    ROOTID,
    SLOT_EVENT,
} from "@idealjs/layout-manager";
import { useSlot,useSns } from "@idealjs/sns-react";
import { nanoid } from "nanoid";
import { useCallback,useMemo } from "react";

import {
    useLayoutNode,
    useLayoutSymbol,
    useMainLayoutSymbol,
    usePanel,
    usePortals,
} from "../features";

const usePopout = (nodeId: string): [boolean, (screen?: IPoint) => void] => {
    const layoutNode = useLayoutNode();
    const layoutSymbol = useLayoutSymbol();
    const sns = useSns();
    const slot = useSlot(nodeId);
    const panel = usePanel(nodeId);
    const mainLayoutSymbol = useMainLayoutSymbol();
    const { portals, setPortals } = usePortals();

    const inPopout = useMemo(
        () => portals.map((p) => p.id).includes(layoutSymbol),
        [layoutSymbol, portals]
    );

    const popoutReady = useCallback(
        (data: { layoutSymbol: string | number }) => {
            console.debug("[Debug] popout ready", data);
            const panelNode = new PanelNode({
                panelJSON: panel!,
            });
            slot?.removeListener("ready", popoutReady);
            sns.send(layoutSymbol, SLOT_EVENT.REMOVE_PANEL, {
                search: panelNode.id,
                mask: MASK_PART.CENTER,
                target: ROOTID,
            } as REMOVE_PANEL_DATA);

            sns.send(data.layoutSymbol, SLOT_EVENT.ADD_PANEL, {
                panelNode: panelNode,
                mask: MASK_PART.CENTER,
                target: ROOTID,
            } as ADD_PANEL_DATA);
        },
        [layoutSymbol, panel, slot, sns]
    );

    const popout = useCallback(
        (screen?: IPoint) => {
            console.debug("[Debug] inPopout", inPopout);

            if (inPopout) {
                console.debug("[Debug] popin", mainLayoutSymbol);
                const panelNode = new PanelNode({
                    panelJSON: panel!,
                });

                layoutNode.doAction(LayoutNodeActionType.REMOVE_PANEL, {
                    search: nodeId,
                });

                sns.send(mainLayoutSymbol, "popin", {
                    panelNode: panelNode,
                });
            } else {
                console.debug("[Debug] popout");
                slot?.addListener("ready", popoutReady);
                setPortals((s) => {
                    return [
                        ...s,
                        { id: nanoid(), left: screen?.x, top: screen?.y },
                    ];
                });
            }
        },
        [
            inPopout,
            panel,
            layoutNode,
            nodeId,
            sns,
            mainLayoutSymbol,
            setPortals,
            slot,
            popoutReady,
        ]
    );

    return [inPopout, popout];
};

export default usePopout;
