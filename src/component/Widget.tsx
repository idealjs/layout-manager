import uniqueId from "lodash.uniqueid";
import { CSSProperties, useEffect, useMemo, useRef } from "react";

import { ADD_RULE } from "../enum";
import useAddNode from "../hook/useAddNode";
import useMoveNode from "../hook/useMoveNode";
import { DND_EVENT, useDnd } from "../lib/dnd";
import useStateContainer from "../lib/useStateContainer";
import Panel from "./Panel";
import { useLayout } from "./Provider/LayoutsProvider";
import { usePanels } from "./Provider/PanelsProvider";
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

const addRuleFromMaskPart = (maskPart: MASK_PART): ADD_RULE => {
    switch (maskPart) {
        case MASK_PART.CENTER:
            return ADD_RULE.TAB;
        case MASK_PART.LEFT:
            return ADD_RULE.LEFT;
        case MASK_PART.RIGHT:
            return ADD_RULE.RIGHT;
        case MASK_PART.TOP:
            return ADD_RULE.TOP;
        case MASK_PART.BOTTOM:
            return ADD_RULE.BOTTOM;
        default:
            throw new Error("");
    }
};

const Widget = (props: { nodeId: string }) => {
    const { nodeId } = props;
    const widgetRef = useRef<HTMLDivElement>(null);
    const [
        maskPartContainer,
        maskPart,
        setMaskPart,
    ] = useStateContainer<MASK_PART | null>(null);
    const moveNode = useMoveNode();
    const addNode = useAddNode();
    const dnd = useDnd();

    const widgetNode = useLayout(nodeId);
    const [panels] = usePanels();

    const selectedNode = useMemo(() => {
        return panels
            .filter((p) => p.parentId === nodeId)
            .find((p) => p.selected === true);
    }, [nodeId, panels]);

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
        try {
            const listenable = dnd
                .droppable(widgetRef.current!, true)
                .addListener(DND_EVENT.DROP, (data) => {
                    if (data.item.type === "Tab") {
                        if (maskPartContainer.current != null) {
                            // moveNode(
                            //     nodeId,
                            //     data.item.id,
                            //     data.item.page,
                            //     maskPartContainer.current
                            // );
                            console.log("test test widget drop", nodeId, data);
                            const { type, ...node } = data.item;
                            addNode(
                                nodeId,
                                {
                                    ...node,
                                    id: uniqueId(),
                                },
                                addRuleFromMaskPart(maskPartContainer.current)
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
                                data.clientPosition.x >
                                    rect.x + rect.width / 4 &&
                                data.clientPosition.x <
                                    rect.x + (rect.width / 4) * 3 &&
                                data.clientPosition.y >
                                    rect.y + rect.height / 4 &&
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
        } catch (error) {
            console.error(error);
        }
    }, [addNode, dnd, maskPartContainer, moveNode, nodeId, setMaskPart]);

    return (
        <div style={widgetStyle}>
            {widgetNode?.children ? (
                <Titlebar nodeIds={widgetNode?.children} />
            ) : null}
            <div
                ref={widgetRef}
                style={{ position: "relative", height: "calc(100% - 25px)" }}
            >
                <div style={maskPartStyle} />
                {widgetNode?.children?.map((nodeId, index, array) => {
                    const hidden =
                        selectedNode?.id !== nodeId &&
                        !(index === 0 && selectedNode == null);
                    return (
                        <Panel key={nodeId} nodeId={nodeId} hidden={hidden} />
                    );
                })}
            </div>
        </div>
    );
};

export default Widget;
