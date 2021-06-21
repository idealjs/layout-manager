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
import { createUseStyles } from "react-jss";
import clsx from "clsx";
import customTab from "../styles/customTab.module.css";

export const useStyles = createUseStyles({
    tab: (data: { selected?: boolean }) => ({
        backgroundColor: data.selected ? "#f7f7f7" : "#00000025",
    }),
    button: {
        "&:hover": {
            backgroundColor: "#00000025",
        },
    },
});

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
    const selected = panel?.selected;
    const classes = useStyles({ selected });

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

    const tabStyle: CSSProperties = useMemo(
        () => ({
            touchAction: "none",
            display: "flex",
            alignItems: "center",
            borderRadius: "10px 10px 0px 0px",
            padding: "0px 10px",
            margin: "2px",
            userSelect: "none",
        }),
        []
    );

    return (
        <div id={nodeId} className={classes.tab} style={tabStyle}>
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
            <div
                className={clsx(classes.button, "Tab_Button")}
                // style={buttonStyle}
                onClick={onPopClick}
            >
                {inPopout ? <Popin /> : <Popout />}
            </div>
            <div
                className={clsx(classes.button, "Tab_Button")}
                // style={buttonStyle}
                onClick={onClose}
            >
                <Close />
            </div>
        </div>
    );
};

export default CustomTab;
