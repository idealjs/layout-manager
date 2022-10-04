import { useLayout, useSplitter, useSplitterRef } from "@idealjs/grape-layout";
import {
    ILayoutNode,
    LAYOUT_DIRECTION,
    SplitterCMPT,
} from "@idealjs/layout-manager";
import { CSSProperties, useMemo } from "react";

export const createSplitterStyle = (config: {
    dragging: boolean;
}): CSSProperties => {
    const { dragging } = config;
    const hoverBackgroundColor = "#00000085";
    return {
        width: "100%",
        height: "100%",
        backgroundColor: dragging ? hoverBackgroundColor : "#00000065",
        userSelect: "none",
        position: "relative",
        zIndex: 1,
    };
};

export const createShadowStyle = (config: {
    parent: ILayoutNode | undefined;
    movingOffset: number;
    dragging: boolean;
}): CSSProperties => {
    const { parent, movingOffset, dragging } = config;
    const parentDirection = parent?.direction;

    let x = parentDirection === LAYOUT_DIRECTION.ROW ? movingOffset : 0;
    let y = parentDirection === LAYOUT_DIRECTION.ROW ? 0 : movingOffset;
    const transform = `translate(${x}px, ${y}px)`;
    return {
        display: dragging ? undefined : "none",
        position: "relative",
        zIndex: -1,
        transform,
        width: "100%",
        height: "100%",
        backgroundColor: "#00000065",
    } as CSSProperties;
};

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

    const [height, width] = useMemo(() => {
        let { height, width } = splitter;
        if (splitter.height === 0) {
            height = 5;
        }
        if (splitter.width === 0) {
            width = 5;
        }
        return [height, width];
    }, [splitter]);

    return (
        <div
            style={{
                position: "absolute",
                height: height,
                width: width,
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
