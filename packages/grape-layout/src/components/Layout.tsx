import {
    ADD_PANEL_DATA,
    LAYOUT_DIRECTION,
    LayoutNodeActionType,
    LayoutNodeUpdate,
    MOVE_PANEL_DATA,
    MOVE_SPLITTER_DATA,
    REMOVE_PANEL_DATA,
    SELECT_TAB_DATA,
    SLOT_EVENT,
} from "@idealjs/layout-manager";
import { useSlot, useSns } from "@idealjs/sns-react";
import { useCallback, useEffect, useRef } from "react";

import { useLayoutNode } from "../features/Provider/LayoutNodeProvider";
import { useLayoutSymbol } from "../features/Provider/LayoutSymbolProvider";
import {
    useLayouts,
    usePanels,
    useSplitters,
} from "../features/Provider/ValtioStateProvider";
import useRect from "../hooks/useRect";
import useUpdate from "../hooks/useUpdate";
import Panel from "./Panel";
import Splitter from "./Splitter";
import Tab from "./Tab";
import Titlebar from "./Titlebar";

const Layout = () => {
    const ref = useRef<HTMLDivElement>(null);

    const splitters = useSplitters();
    const layouts = useLayouts();
    const panels = usePanels();

    useInitSlotListener(ref);

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
                    return (
                        <Titlebar key={n.id} nodeId={n.id}>
                            {n.children.map((id) => (
                                <Tab key={id} nodeId={id} />
                            ))}
                        </Titlebar>
                    );
                })}
            {splitters.map((n) => {
                return (
                    <Splitter
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

const useInitSlotListener = (ref: React.RefObject<HTMLDivElement>) => {
    const [rect] = useRect(ref);
    const layoutNode = useLayoutNode();
    const layoutSymbol = useLayoutSymbol();
    const sns = useSns();
    const slot = useSlot(layoutSymbol);

    const update = useUpdate();

    const addPanel = useCallback(
        (data: ADD_PANEL_DATA) => {
            console.debug("[Debug] addPanel", data);
            layoutNode.doAction(LayoutNodeActionType.ADD_PANEL, data);
            update(rect);
        },
        [layoutNode, rect, update]
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

            update(rect);
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
        rect,
        removePanel,
        selectTab,
        slot,
        sns,
        update,
    ]);
};
