import { CSSProperties, forwardRef, useCallback } from "react";
import {
    MASK_PART,
    SLOT_EVENT,
    usePanel,
    TABCMPT,
    useSlot,
    useSns,
    PanelNode,
    ROOTID,
    useLayoutSymbol,
    REMOVE_PANEL_DATA,
    ADD_PANEL_DATA,
} from "@idealjs/layout-manager";

import Close from "../svg/Close";
import Popout from "../svg/Popout";
import { usePortals } from "./PopoutManager";
import { uniqueId } from "lodash";
import { useMemo } from "react";
import Popin from "../svg/Popin";
import { useMainLayoutSymbol } from "./MainLayoutSymbolProvider";

const root: CSSProperties = {
    touchAction: "none",
    backgroundColor: "#00000025",
    display: "flex",
    alignItems: "center",
    borderStyle: "solid",
    borderWidth: "thin",
    margin: "2px",
    userSelect: "none",
};
const close = {
    marginLeft: "4px",
    marginRight: "2px",
    "&:hover": {
        backgroundColor: "#00000025",
    },
    width: "16px",
    height: "16px",
};

const CustomTab: TABCMPT = forwardRef((props, ref) => {
    const { nodeId, nodeTitle, onClose, onSelect } = props;
    const { setPortals } = usePortals();
    const mainLayoutSymbol = useMainLayoutSymbol();
    const layoutSymbol = useLayoutSymbol();
    const sns = useSns();
    const slot = useSlot(nodeId);

    const panel = usePanel(nodeId);

    const { portals } = usePortals();

    const popout = useMemo(() => portals.includes(layoutSymbol), [
        layoutSymbol,
        portals,
    ]);

    const popoutReady = useCallback(
        (data: { layoutSymbol: string | number }) => {
            console.debug("[Debug] popout ready", data);
            const panelNode = new PanelNode({
                panelJSON: panel!,
            });
            slot.removeListener("ready", popoutReady);
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

    const onPopClick = useCallback(() => {
        if (popout) {
            console.debug("[Debug] popint");
            const panelNode = new PanelNode({
                panelJSON: panel!,
            });
            sns.send(layoutSymbol, SLOT_EVENT.REMOVE_PANEL, {
                search: panelNode.id,
            } as REMOVE_PANEL_DATA);

            sns.send(mainLayoutSymbol, "popin", {
                panelNode: panelNode,
                mask: MASK_PART.CENTER,
                targetId: ROOTID,
            });
        } else {
            console.debug("[Debug] popout");
            slot.addListener("ready", popoutReady);
            setPortals((s) => {
                return [...s, uniqueId()];
            });
        }
    }, [
        layoutSymbol,
        mainLayoutSymbol,
        panel,
        popout,
        popoutReady,
        setPortals,
        slot,
        sns,
    ]);

    return (
        <div id={nodeId} className={"Tab"} style={root}>
            <div
                ref={ref}
                style={{ lineHeight: "100%", textAlign: "center" }}
                onClick={onSelect}
            >
                {nodeTitle}
            </div>
            <div style={close} onClick={onPopClick}>
                {popout ? <Popin /> : <Popout />}
            </div>
            <div style={close} onClick={onClose}>
                <Close />
            </div>
        </div>
    );
});

export default CustomTab;
