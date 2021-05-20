import Panel from "components/Panel";
import { useLayoutNode } from "components/providers/LayoutNodeProvider";
import { useLayouts } from "components/providers/LayoutsProvider";
import { useLayoutSymbol } from "components/providers/LayoutSymbolProvider";
import { usePanels } from "components/providers/PanelsProvider";
import { useSlot, useSns } from "components/providers/SnsProvider";
import { useSplitters } from "components/providers/SplittersProvider";
import Splitter from "components/Splitter";
import Titlebar from "components/Titlebar";
import useRect from "hooks/useRect";
import useUpdate from "hooks/useUpdate";
import { useCallback, useEffect, useRef } from "react";
import { LAYOUT_DIRECTION, SLOT_EVENT } from "src/enum";
import {
    ADD_PANEL_DATA,
    MOVE_PANEL_DATA,
    MOVE_SPLITTER_DATA,
    REMOVE_PANEL_DATA,
    SELECT_TAB_DATA,
} from "src/type";

const Layout = () => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [rect] = useRect(ref);
    const layoutNode = useLayoutNode();
    const [splitters] = useSplitters();
    const [layouts] = useLayouts();
    const [panels] = usePanels();
    const layoutSymbol = useLayoutSymbol();
    const sns = useSns();
    const slot = useSlot(layoutSymbol);

    const update = useUpdate(rect);

    const addPanel = useCallback(
        (data: ADD_PANEL_DATA) => {
            console.debug("[Debug] addPanel", data);
            layoutNode.addPanelNode(data.panelNode, data.mask, data.target);
            update();
        },
        [layoutNode, update]
    );

    const removePanel = useCallback(
        (data: REMOVE_PANEL_DATA) => {
            layoutNode.removePanelNode(data.search);
            update();
        },
        [layoutNode, update]
    );

    const movePanel = useCallback(
        (data: MOVE_PANEL_DATA) => {
            layoutNode.movePanelNode(data.search, data.mask, data.target);
            update();
        },
        [layoutNode, update]
    );

    const moveSplitter = useCallback(
        (data: MOVE_SPLITTER_DATA) => {
            const primaryNode = layoutNode.getLayoutById(data.primary);
            const secondaryNode = layoutNode.getLayoutById(data.secondary);

            if (primaryNode != null && secondaryNode != null) {
                primaryNode.secondaryOffset =
                    primaryNode.secondaryOffset + data.offset;
                secondaryNode.primaryOffset =
                    secondaryNode.primaryOffset - data.offset;
            }
            update();
        },
        [layoutNode, update]
    );

    const selectTab = useCallback(
        (data: SELECT_TAB_DATA) => {
            const panelNode = layoutNode.getPanelById(data.selected);

            if (
                panelNode != null &&
                panelNode.parent != null &&
                panelNode.selected === false
            ) {
                panelNode.parent.panelNodes.forEach(
                    (p) => (p.selected = false)
                );
                panelNode.selected = true;
                update();
            }
        },
        [layoutNode, update]
    );

    useEffect(() => {
        update();
        slot.addListener(SLOT_EVENT.ADD_PANEL, addPanel);
        slot.addListener(SLOT_EVENT.REMOVE_PANEL, removePanel);
        slot.addListener(SLOT_EVENT.MOVE_PANEL, movePanel);
        slot.addListener(SLOT_EVENT.MOVE_SPLITTER, moveSplitter);
        slot.addListener(SLOT_EVENT.SELECT_TAB, selectTab);

        sns.broadcast("ready", { layoutSymbol });

        return () => {
            slot.removeListener(SLOT_EVENT.ADD_PANEL, addPanel);
            slot.removeListener(SLOT_EVENT.REMOVE_PANEL, removePanel);
            slot.removeListener(SLOT_EVENT.MOVE_PANEL, movePanel);
            slot.removeListener(SLOT_EVENT.MOVE_SPLITTER, moveSplitter);
            slot.removeListener(SLOT_EVENT.SELECT_TAB, selectTab);
        };
    }, [
        addPanel,
        layoutSymbol,
        movePanel,
        moveSplitter,
        removePanel,
        selectTab,
        slot,
        sns,
        update,
    ]);

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
                    return <Titlebar key={n.id} nodeId={n.id} />;
                })}
            {splitters.map((n) => {
                return (
                    <div
                        id={n.id}
                        key={n.id}
                        style={{
                            position: "absolute",
                            height: n.height,
                            width: n.width,
                            left: n.left,
                            top: n.top,
                        }}
                    >
                        <Splitter
                            id={n.id}
                            parentId={n.parentId}
                            primaryId={n.primaryId}
                            secondaryId={n.secondaryId}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default Layout;
