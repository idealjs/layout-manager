import { useEffect, useRef } from "react";

import useParse from "../lib/useParse";
import useRect from "../lib/useRect";
import { setAll } from "../reducer/widgets";
import { useSplitters } from "./Provider/SplittersProvider";
import { useWidgets } from "./Provider/WidgetsProvider";
import Splitter from "./Splitter";
// import Splitter from "./Splitter";
import Widget from "./Widget";

const Layout = () => {
    const [ref, rect] = useRect();
    const [widgets, splitters] = useParse(rect);

    return (
        <div
            ref={ref}
            style={{ height: "100%", width: "100%", position: "relative" }}
        >
            {widgets.map((n) => {
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
