import { useEffect, useRef } from "react";

import useRect from "../hook/useRect";
import LayoutNode from "../lib/LayoutNode";
import { setAll as setAllLayouts } from "../reducer/layouts";
import { setAll as setAllSplitters } from "../reducer/splitters";
import { LAYOUT_DIRECTION } from "../reducer/type";
import { useLayouts } from "./Provider/LayoutsProvider";
import { useSplitters } from "./Provider/SplittersProvider";
import Splitter from "./Splitter";
import Widget from "./Widget";

const Layout = (props: { layoutNode: LayoutNode }) => {
    const { layoutNode } = props;
    const ref = useRef<HTMLDivElement | null>(null);
    const [rect] = useRect(ref);

    const [splitters, , dispatchSplitters] = useSplitters();
    const [layouts, , dispatchLayouts] = useLayouts();

    useEffect(() => {
        layoutNode.fill({ ...rect, left: 0, top: 0 });
        const layouts = layoutNode.parseLayout();
        const splitters = layoutNode.parseSplitter();
        dispatchLayouts(setAllLayouts(layouts));
        dispatchSplitters(setAllSplitters(splitters));
    }, [dispatchLayouts, dispatchSplitters, layoutNode, rect]);

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
