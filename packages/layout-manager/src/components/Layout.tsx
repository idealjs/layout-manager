import { useStore } from "@idealjs/effector";
import { useSlot, useSns } from "@idealjs/sns";
import { useCallback, useEffect, useRef } from "react";

import { LAYOUT_DIRECTION, SLOT_EVENT } from "../enum";
import useRect from "../hooks/useRect";
import useUpdate from "../hooks/useUpdate";
import { LayoutNodeUpdate } from "../lib/LayoutNode";
import { LayoutNodeActionType } from "../lib/LayoutNode";
import { useLayouts } from "../stores/layouts";
import { usePanels } from "../stores/panels";
import $splitters from "../stores/splitters";
import {
    ADD_PANEL_DATA,
    MOVE_PANEL_DATA,
    MOVE_SPLITTER_DATA,
    REMOVE_PANEL_DATA,
    SELECT_TAB_DATA,
} from "../type";
import Panel from "./Panel";
import { useCustomSplitter, useCustomTitlebar } from "./Provider";
import { useLayoutNode } from "./providers/LayoutNodeProvider";
import { useLayoutSymbol } from "./providers/LayoutSymbolProvider";

const Layout = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [rect] = useRect(ref);
    const layoutNode = useLayoutNode();
    const splitters = useStore($splitters);
    const layouts = useLayouts();
    const panels = usePanels();
    const layoutSymbol = useLayoutSymbol();
    const sns = useSns();
    const slot = useSlot(layoutSymbol);

    const update = useUpdate(rect);

    const addPanel = useCallback(
        (data: ADD_PANEL_DATA) => {
            console.debug("[Debug] addPanel", data);
            layoutNode.doAction(LayoutNodeActionType.ADD_PANEL, data);
            update();
        },
        [layoutNode, update]
    );

    const removePanel = useCallback(
        (data: REMOVE_PANEL_DATA) => {
            layoutNode.doAction(LayoutNodeActionType.REMOVE_PANEL, data);
        },
        [layoutNode]
    );

    const movePanel = useCallback(
        (data: MOVE_PANEL_DATA) => {
            layoutNode.doAction(LayoutNodeActionType.MOVE_PANEL, data);
        },
        [layoutNode]
    );

    const moveSplitter = useCallback(
        (data: MOVE_SPLITTER_DATA) => {
            layoutNode.doAction(LayoutNodeActionType.MOVE_SPLITTER, data);
        },
        [layoutNode]
    );

    const selectTab = useCallback(
        (data: SELECT_TAB_DATA) => {
            layoutNode.doAction(LayoutNodeActionType.SELECT_TAB, data);
        },
        [layoutNode]
    );

    useEffect(() => {
        if (slot) {
            slot.addListener(SLOT_EVENT.ADD_PANEL, addPanel);
            slot.addListener(SLOT_EVENT.REMOVE_PANEL, removePanel);
            slot.addListener(SLOT_EVENT.MOVE_PANEL, movePanel);
            slot.addListener(SLOT_EVENT.MOVE_SPLITTER, moveSplitter);
            slot.addListener(SLOT_EVENT.SELECT_TAB, selectTab);
            sns.broadcast("ready", { layoutSymbol });

            update();
        }
        layoutNode.addListener(LayoutNodeUpdate, update);

        return () => {
            slot?.removeListener(SLOT_EVENT.ADD_PANEL, addPanel);
            slot?.removeListener(SLOT_EVENT.REMOVE_PANEL, removePanel);
            slot?.removeListener(SLOT_EVENT.MOVE_PANEL, movePanel);
            slot?.removeListener(SLOT_EVENT.MOVE_SPLITTER, moveSplitter);
            slot?.removeListener(SLOT_EVENT.SELECT_TAB, selectTab);
            layoutNode.removeListener(LayoutNodeUpdate, update);
        };
    }, [
        addPanel,
        layoutNode,
        layoutSymbol,
        movePanel,
        moveSplitter,
        removePanel,
        selectTab,
        slot,
        sns,
        update,
    ]);

    const CustomTitlebar = useCustomTitlebar();
    const CustomSplitter = useCustomSplitter();
    return (
        <div
            ref={ref}
            style={{ height: "100%", width: "100%", position: "relative" }}
        >
            {panels.map((p) => {
                return <Panel key={p.id} nodeId={p.id} />;
            })}
            {layouts
                .filter((l) => l.direction === LAYOUT_DIRECTION.TAB)
                .map((n) => {
                    return <CustomTitlebar key={n.id} nodeId={n.id} />;
                })}
            {splitters.map((n) => {
                return (
                    <CustomSplitter
                        id={n.id}
                        key={n.id}
                        parentId={n.parentId}
                        primaryId={n.primaryId}
                        secondaryId={n.secondaryId}
                    />
                );
            })}
        </div>
    );
};

export default Layout;
