import {
    LAYOUT_DIRECTION,
    SplitterCMPT,
    useLayout,
    useSplitter,
} from "@idealjs/layout-manager";
import { useMemo } from "react";

import useSplitterRef, {
    createShadowStyle,
    createSplitterStyle,
} from "../hooks/useSplitterRef";

const Splitter: SplitterCMPT = (props) => {
    const { id, parentId, primaryId, secondaryId } = props;
    const splitter = useSplitter(id)!;
    const { ref, shadowRef, dragging, movingOffset } = useSplitterRef({
        id,
        parentId,
        primaryId,
        secondaryId,
    });

    const parent = useLayout(parentId);

    const splitterStyle = useMemo(() => {
        const cursor =
            parent?.direction === LAYOUT_DIRECTION.ROW
                ? "ew-resize"
                : "ns-resize";
        return {
            ...createSplitterStyle({
                dragging,
            }),
            cursor: cursor,
        };
    }, [dragging, parent?.direction]);

    const shadowStyle = useMemo(() => {
        return createShadowStyle({ parent, dragging, movingOffset });
    }, [dragging, movingOffset, parent]);

    return (
        <div
            style={{
                position: "absolute",
                height: splitter.height,
                width: splitter.width,
                left: splitter.left,
                top: splitter.top,
            }}
        >
            <div id={id} ref={ref} style={splitterStyle}>
                <div ref={shadowRef} style={shadowStyle}></div>
            </div>
        </div>
    );
};

export default Splitter;
