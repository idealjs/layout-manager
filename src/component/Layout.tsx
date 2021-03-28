import { useCallback, useEffect, useRef } from "react";

import { MASK_PART, SLOT_EVENT } from "../enum";
import useRect from "../hook/useRect";
import directionFromMask from "../lib/directionFromMask";
import LayoutNode from "../lib/LayoutNode";
import { setAll as setAllLayouts } from "../reducer/layouts";
import { setAll as setAllPanels } from "../reducer/panels";
import { setAll as setAllSplitters } from "../reducer/splitters";
import { LAYOUT_DIRECTION } from "../reducer/type";
import Panel from "./Panel";
import { useLayouts } from "./Provider/LayoutsProvider";
import { useLayoutSymbol } from "./Provider/LayoutSymbolProvider";
import { usePanels } from "./Provider/PanelsProvider";
import { useSlot, useSns } from "./Provider/SnsProvider";
import { useSplitters } from "./Provider/SplittersProvider";
import Splitter from "./Splitter";
import Titlebar from "./Titlebar";

const useUpdate = (
    layoutNode: LayoutNode,
    rect: {
        height: number;
        width: number;
    }
) => {
    const [, , dispatchSplitters] = useSplitters();
    const [, , dispatchLayouts] = useLayouts();
    const [, , dispatchPanels] = usePanels();
    return useCallback(() => {
        layoutNode.shakeTree();
        layoutNode.fill({ ...rect, left: 0, top: 0 });
        const layouts = layoutNode.parseLayout();
        const splitters = layoutNode.parseSplitter();
        const panels = layoutNode.parsePanel();
        dispatchLayouts(setAllLayouts(layouts));
        dispatchSplitters(setAllSplitters(splitters));
        dispatchPanels(setAllPanels(panels));
    }, [dispatchLayouts, dispatchPanels, dispatchSplitters, layoutNode, rect]);
};

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
            console.log(SLOT_EVENT.ADD_PANEL, data);

            const direction = directionFromMask(data.mask);
            if (data.mask === MASK_PART.CENTER) {
                layoutNode
                    .findPanelNode((p) => p.id === data.targetId)
                    ?.parent?.appendPanelNode(data.panelNode);
            } else {
                const tabLayout = new LayoutNode();
                tabLayout.direction = LAYOUT_DIRECTION.TAB;
                tabLayout.appendPanelNode(data.panelNode);
                const layout = new LayoutNode();
                layout.direction = direction;
                const oldLayout = layoutNode.findPanelNode(
                    (p) => p.id === data.targetId
                )?.parent;

                if (oldLayout == null) {
                    throw new Error("");
                }
                oldLayout.parent?.replaceChild(layout, oldLayout);
                oldLayout.primaryOffset = 0;
                oldLayout.secondaryOffset = 0;
                if (
                    data.mask === MASK_PART.LEFT ||
                    data.mask === MASK_PART.TOP
                ) {
                    layout.append(tabLayout, oldLayout);
                }
                if (
                    data.mask === MASK_PART.RIGHT ||
                    data.mask === MASK_PART.BOTTOM
                ) {
                    layout.append(oldLayout, tabLayout);
                }
            }
            update();
        },
        [layoutNode, update]
    );

    const removePanel = useCallback(
        (data) => {
            const panelNode = layoutNode.findPanelNode(
                (p) => p.id === data.searchId
            );
            panelNode?.remove();
            update();
            if (data.symbol != null) {
                sns.send(data.symbol, SLOT_EVENT.NODE_REMOVED, { panelNode });
            }
        },
        [layoutNode, sns, update]
    );

    const movePanel = useCallback(
        (data) => {
            if (
                data.searchId === data.targetId &&
                data.mask === MASK_PART.CENTER
            ) {
                update();
                return;
            }

            const panelNode = layoutNode.findPanelNode(
                (p) => p.id === data.searchId
            );
            
            if (
                panelNode?.parent?.panelNodes.length === 1 &&
                data.searchId === data.targetId
            ) {
                update();
                return;
            }

            if (panelNode == null) {
                throw new Error("");
            }

            panelNode.remove();

            const direction = directionFromMask(data.mask);
            if (data.mask === MASK_PART.CENTER) {
                layoutNode
                    .findPanelNode((p) => p.id === data.targetId)
                    ?.parent?.appendPanelNode(panelNode);
            } else {
                const tabLayout = new LayoutNode();
                tabLayout.direction = LAYOUT_DIRECTION.TAB;
                tabLayout.appendPanelNode(panelNode);
                const layout = new LayoutNode();
                layout.direction = direction;
                const oldLayout = layoutNode.findPanelNode(
                    (p) => p.id === data.targetId
                )?.parent;

                if (oldLayout == null) {
                    throw new Error("");
                }
                oldLayout.parent?.replaceChild(layout, oldLayout);
                oldLayout.primaryOffset = 0;
                oldLayout.secondaryOffset = 0;
                if (
                    data.mask === MASK_PART.LEFT ||
                    data.mask === MASK_PART.TOP
                ) {
                    layout.append(tabLayout, oldLayout);
                }
                if (
                    data.mask === MASK_PART.RIGHT ||
                    data.mask === MASK_PART.BOTTOM
                ) {
                    layout.append(oldLayout, tabLayout);
                }
            }
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
        layoutNode,
        removePanel,
        slot,
        sns,
        update,
        moveSplitter,
        selectTab,
        movePanel,
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
