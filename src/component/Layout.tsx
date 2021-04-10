import { useCallback, useEffect, useRef } from "react";

import { SLOT_EVENT } from "../enum";
import useRect from "../hook/useRect";
import useUpdate from "../hook/useUpdate";
import LayoutNode from "../lib/LayoutNode";
import { LAYOUT_DIRECTION } from "../reducer/type";
import Panel from "./Panel";
import { useLayouts } from "./Provider/LayoutsProvider";
import { useLayoutSymbol } from "./Provider/LayoutSymbolProvider";
import { usePanels } from "./Provider/PanelsProvider";
import { useSlot, useSns } from "./Provider/SnsProvider";
import { useSplitters } from "./Provider/SplittersProvider";
import Splitter from "./Splitter";
import Titlebar from "./Titlebar";

const Layout = (props: { layoutNode: LayoutNode }) => {
    const { layoutNode } = props;
    const ref = useRef<HTMLDivElement | null>(null);
    const [rect] = useRect(ref);

    const [splitters] = useSplitters();
    const [layouts] = useLayouts();
    const [panels] = usePanels();
    const layoutSymbol = useLayoutSymbol();
    const sns = useSns();
    const slot = useSlot(layoutSymbol);

    const update = useUpdate(layoutNode, rect);

    const addPanel = useCallback(
        (data) => {
            layoutNode.addPanelNode(data.panelNode, data.mask, data.targetId);
            update();
        },
        [layoutNode, update]
    );

    const removePanel = useCallback(
        (data) => {
            const removed = layoutNode.removePanelNode(data);
            update();
            if (data.symbol != null) {
                sns.send(data.symbol, SLOT_EVENT.NODE_REMOVED, {
                    panelNode: removed,
                });
            }
        },
        [layoutNode, sns, update]
    );

    const movePanel = useCallback(
        (data) => {
            layoutNode.movePanelNode(data.searchId, data.mask, data.targetId);
            update();
        },
        [layoutNode, update]
    );

    const moveSplitter = useCallback(
        (data) => {
            const primaryNode = layoutNode.find((l) => l.id === data.primaryId);
            const secondaryNode = layoutNode.find(
                (l) => l.id === data.secondaryId
            );
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
        (data) => {
            const panelNode = layoutNode.findPanelNode((p) => p.id === data.id);
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

        return () => {
            slot.removeListener(SLOT_EVENT.ADD_PANEL, addPanel);
            slot.removeListener(SLOT_EVENT.REMOVE_PANEL, removePanel);
            slot.removeListener(SLOT_EVENT.MOVE_PANEL, movePanel);
            slot.removeListener(SLOT_EVENT.MOVE_SPLITTER, moveSplitter);
            slot.removeListener(SLOT_EVENT.SELECT_TAB, selectTab);
        };
    }, [
        addPanel,
        movePanel,
        moveSplitter,
        removePanel,
        selectTab,
        slot,
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
