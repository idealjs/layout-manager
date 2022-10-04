import {
    useInitSlotListener,
    useLayouts,
    usePanels,
    useSplitters,
} from "@idealjs/grape-layout";
import { LAYOUT_DIRECTION } from "@idealjs/layout-manager";
import { useRef } from "react";

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
