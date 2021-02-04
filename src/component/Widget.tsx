import { DND_EVENT, useDnd } from "@idealjs/drag-drop";
import { CSSProperties, useEffect, useMemo, useRef } from "react";

import useMoveNode from "../hook/useMoveNode";
import useStateContainer from "../lib/useStateContainer";
import { selectById } from "../reducer/nodes";
import Panel from "./Panel";
import { useNode } from "./Provider";
import Titlebar from "./Titlebar";
export enum MASK_PART {
    TOP = "top",
    LEFT = "left",
    BOTTOM = "bottom",
    RIGHT = "right",
    CENTER = "center",
}

const top: CSSProperties = {
    zIndex: 1,
    pointerEvents: "none",
    border: "2px dashed",
    position: "absolute",
    width: "calc(100% - 4px)",
    height: "50%",
    top: 0,
    left: 0,
};
const left: CSSProperties = {
    zIndex: 1,
    pointerEvents: "none",
    border: "2px dashed",
    position: "absolute",
    width: "50%",
    height: "calc(100% - 4px)",
    top: 0,
    left: 0,
};
const bottom: CSSProperties = {
    zIndex: 1,
    pointerEvents: "none",
    border: "2px dashed",
    position: "absolute",
    width: "calc(100% - 4px)",
    height: "50%",
    right: 0,
    bottom: 0,
};
const right: CSSProperties = {
    zIndex: 1,
    pointerEvents: "none",
    border: "2px dashed",
    position: "absolute",
    width: "50%",
    height: "calc(100% - 4px)",
    bottom: 0,
    right: 0,
};
const center: CSSProperties = {
    zIndex: 1,
    pointerEvents: "none",
    border: "2px dashed",
    position: "absolute",
    width: "calc(100% - 4px)",
    height: "calc(100% - 4px)",
    bottom: 0,
    right: 0,
};
const hide: CSSProperties = {
    display: "none",
};

const Widget = (props: { nodeId: string }) => {
    const { nodeId } = props;
    const ref = useRef<HTMLDivElement>(null);
    const widgetRef = useRef<HTMLDivElement>(null);
    const [
        maskPartContainer,
        maskPart,
        setMaskPart,
    ] = useStateContainer<MASK_PART | null>(null);
    const moveNode = useMoveNode();
    const [nodes, dispatch] = useNode();

    const dnd = useDnd();

    const node = useMemo(() => selectById(nodes, nodeId), [nodeId, nodes]);

    const selectedNodeId = useMemo(() => {
        return node?.children
            ?.map((childId) => selectById(nodes, childId))
            .find((child) => child?.selected === true)?.id;
    }, [node, nodes]);

    const widgetStyle: CSSProperties = useMemo(() => {
        const width = "100%";
        const height = "100%";
        return {
            width,
            height,
            userSelect: "none",
        };
    }, []);

    const maskPartStyle = useMemo(() => {
        switch (maskPart) {
            case MASK_PART.BOTTOM:
                return bottom;
            case MASK_PART.CENTER:
                return center;
            case MASK_PART.LEFT:
                return left;
            case MASK_PART.RIGHT:
                return right;
            case MASK_PART.TOP:
                return top;
            default:
                return hide;
        }
    }, [maskPart]);

    useEffect(() => {
        const listenable = dnd
            .droppable(widgetRef.current!)
            .addListener(DND_EVENT.DROP, (data) => {
                if (data.item.type === "Tab") {
                    if (maskPartContainer.current != null) {
                        moveNode(
                            nodeId,
                            data.item.id,
                            maskPartContainer.current
                        );
                    }
                    setMaskPart(null);
                }
            })
            .addListener(DND_EVENT.DRAG_LEAVE, (data) => {
                if (data.item.type === "Tab") {
                    setMaskPart(null);
                }
            })
            .addListener(DND_EVENT.DRAG_OVER, (data) => {
                if (data.item.type === "Tab") {
                    const rect = widgetRef.current?.getBoundingClientRect();
                    if (rect) {
                        if (
                            data.clientPosition.x > rect.x + rect.width / 4 &&
                            data.clientPosition.x <
                                rect.x + (rect.width / 4) * 3 &&
                            data.clientPosition.y > rect.y + rect.height / 4 &&
                            data.clientPosition.y <
                                rect.y + (rect.height / 4) * 3
                        ) {
                            setMaskPart(MASK_PART.CENTER);
                            return;
                        }
                        if (
                            data.clientPosition.x > rect.x &&
                            data.clientPosition.x < rect.x + rect.width / 4
                        ) {
                            setMaskPart(MASK_PART.LEFT);
                            return;
                        }

                        if (
                            data.clientPosition.x >
                                rect.x + (rect.width / 4) * 3 &&
                            data.clientPosition.x < rect.x + rect.width
                        ) {
                            setMaskPart(MASK_PART.RIGHT);
                            return;
                        }

                        if (
                            data.clientPosition.y > rect.y &&
                            data.clientPosition.y < rect.y + rect.height / 4
                        ) {
                            setMaskPart(MASK_PART.TOP);
                            return;
                        }

                        if (
                            data.clientPosition.y >
                                rect.y + (rect.height / 4) * 3 &&
                            data.clientPosition.y < rect.y + rect.height
                        ) {
                            setMaskPart(MASK_PART.BOTTOM);
                            return;
                        }
                    }
                }
            });
        return () => {
            listenable.removeAllListeners();
        };
    }, [
        dispatch,
        dnd,
        maskPartContainer,
        moveNode,
        nodeId,
        nodes,
        setMaskPart,
    ]);

    return (
        <div ref={ref} style={widgetStyle}>
            {node?.children ? <Titlebar nodeIds={node?.children} /> : null}
            <div
                ref={widgetRef}
                style={{ position: "relative", height: "calc(100% - 25px)" }}
            >
                <div style={maskPartStyle} />
                {node?.children?.map((nodeId) => {
                    console.log(selectedNodeId, nodeId);
                    return (
                        <Panel
                            key={nodeId}
                            nodeId={nodeId}
                            hidden={selectedNodeId !== nodeId}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Widget;
