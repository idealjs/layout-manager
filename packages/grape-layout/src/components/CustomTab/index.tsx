import {
    ADD_PANEL_DATA,
    Close,
    LayoutNodeActionType,
    MASK_PART,
    PanelNode,
    Popin,
    Popout,
    REMOVE_PANEL_DATA,
    ROOTID,
    SELECT_TAB_DATA,
    SLOT_EVENT,
    TABCMPT,
    useLayoutNode,
    useLayoutSymbol,
    usePanel,
    useTabRef,
} from "@idealjs/layout-manager";
import { useSlot, useSns } from "@idealjs/sns";
import clsx from "clsx";
import { nanoid } from "nanoid";
import { useCallback } from "react";
import { useMemo } from "react";

import { useMainLayoutSymbol } from "../MainLayoutSymbolProvider";
import { usePortals } from "../PopoutManager";
import styles from "./index.module.css";

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

    const onPopClick = useCallback(() => {
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
        <div
            id={nodeId}
            className={clsx({
                [styles.tab]: true,
                [styles.tab_selected]: selected,
            })}
        >
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
            <div className={styles.button} onClick={onPopClick}>
                {inPopout ? <Popin /> : <Popout />}
            </div>
            <div className={styles.button} onClick={onClose}>
                <Close />
            </div>
        </div>
    );
};

export default CustomTab;