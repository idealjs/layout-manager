import {
    ADD_PANEL_DATA,
    LayoutNodeActionType,
    LayoutNodeUpdate,
    MOVE_PANEL_DATA,
    MOVE_SPLITTER_DATA,
    REMOVE_PANEL_DATA,
    SELECT_TAB_DATA,
    SLOT_EVENT,
} from "@idealjs/layout-manager";
import { useSlot, useSns } from "@idealjs/sns-react";
import { useCallback, useEffect } from "react";

import { useLayoutNode, useLayoutSymbol } from "../features";
import useRect from "./useRect";
import useUpdate from "./useUpdate";

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

export default useInitSlotListener;
