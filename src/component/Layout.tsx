import { useCallback, useEffect, useRef } from "react";

import useRect from "../hook/useRect";
import LayoutNode from "../lib/LayoutNode";
import { setAll as setAllLayouts } from "../reducer/layouts";
import { setAll as setAllPanels } from "../reducer/panels";
import { setAll as setAllSplitters } from "../reducer/splitters";
import { LAYOUT_DIRECTION } from "../reducer/type";
import { useLayouts } from "./Provider/LayoutsProvider";
import { useLayoutSymbol } from "./Provider/LayoutSymbolProvider";
import { usePanels } from "./Provider/PanelsProvider";
import { useSlot, useSns } from "./Provider/SnsProvider";
import { useSplitters } from "./Provider/SplittersProvider";
import Splitter from "./Splitter";
import Widget from "./Widget";

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
        layoutNode.fill({ ...rect, left: 0, top: 0 });
        layoutNode.shakeTree();
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
    const layoutSymbol = useLayoutSymbol();
    const sns = useSns();
    const slot = useSlot(layoutSymbol);

    const update = useUpdate(layoutNode, rect);

    const addNode = useCallback(
        (data) => {
            update();
            console.log("addNode", data);
        },
        [update]
    );

    const removeNode = useCallback(
        (data) => {
            console.log("removeNode", data);
            update();
            sns.send(data.item.symbol, "nodeRemoved", { test: "test" });
        },
        [sns, update]
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

    useEffect(() => {
        update();
        slot.addListener("addNode", addNode);
        slot.addListener("removeNode", removeNode);
        slot.addListener("movesplitter", moveSplitter);
        return () => {
            slot.removeListener("addNode", addNode);
            slot.removeListener("removeNode", removeNode);
            slot.removeListener("movesplitter", moveSplitter);
        };
    }, [addNode, layoutNode, removeNode, slot, sns, update, moveSplitter]);

    return (
        <div
            ref={ref}
            style={{ height: "100%", width: "100%", position: "relative" }}
        >
            {layouts
                .filter((l) => l.direction === LAYOUT_DIRECTION.TAB)
                .map((n) => {
                    return (
                        <div
                            key={n.id}
                            style={{
                                position: "absolute",
                                height: n.height,
                                width: n.width,
                                left: n.left,
                                top: n.top,
                            }}
                        >
                            <Widget nodeId={n.id} />
                        </div>
                    );
                })}

            {splitters.map((n) => {
                return (
                    <div
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
