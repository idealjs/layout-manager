import { CSSProperties, useCallback } from "react";
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
    useLayoutNode,
    SELECT_TAB_DATA,
    useTabRef,
    Close,
    Popout,
    Popin,
    LayoutNodeActionType,
} from "@idealjs/layout-manager";

import { usePortals } from "./PopoutManager";
import { nanoid } from "nanoid";
import { useMemo } from "react";
import { useMainLayoutSymbol } from "./MainLayoutSymbolProvider";

const root: CSSProperties = {
    touchAction: "none",
    backgroundColor: "#00000025",
    display: "flex",
    alignItems: "center",
    borderRadius: "10px 10px 0px 0px",
    padding: "0px 10px",
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

const CustomTab: TABCMPT = (props) => {
    const { nodeId } = props;
    const ref = useTabRef(nodeId);

    const { portals, setPortals } = usePortals();

    const layoutNode = useLayoutNode();
    const layoutSymbol = useLayoutSymbol();
    const mainLayoutSymbol = useMainLayoutSymbol();
    const sns = useSns();
    const slot = useSlot(nodeId);
    const panel = usePanel(nodeId);
    // const selected = panel?.selected;

    const inPopout = useMemo(
        () => portals.includes(layoutSymbol),
        [layoutSymbol, portals]
    );

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
        if (inPopout) {
            console.debug("[Debug] popint");
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
            slot.addListener("ready", popoutReady);
            setPortals((s) => {
                return [...s, nanoid()];
            });
        }
    }, [
        inPopout,
        panel,
        layoutNode,
        nodeId,
        sns,
        mainLayoutSymbol,
        setPortals,
        slot,
        popoutReady,
    ]);

    const onSelect = useCallback(() => {
        sns.send(layoutSymbol, SLOT_EVENT.SELECT_TAB, {
            search: nodeId,
        } as SELECT_TAB_DATA);
    }, [layoutSymbol, nodeId, sns]);

    const onClose = useCallback(() => {
        sns.send(layoutSymbol, SLOT_EVENT.REMOVE_PANEL, {
            search: nodeId,
        } as REMOVE_PANEL_DATA);
    }, [layoutSymbol, nodeId, sns]);

    return (
        <div id={nodeId} className={"Tab"} style={root}>
            <div
                ref={ref}
                style={{
                    lineHeight: "100%",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                }}
                onClick={onSelect}
            >
                {nodeId}
            </div>
            <div style={close} onClick={onPopClick}>
                {inPopout ? <Popin /> : <Popout />}
            </div>
            <div style={close} onClick={onClose}>
                <Close />
            </div>
        </div>
    );
};

export default CustomTab;
