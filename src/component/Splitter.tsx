import { DND_EVENT, useDnd } from "@idealjs/drag-drop";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";

import { DIRECTION, selectById, updateMany } from "../reducer/nodes";
import { useNode } from "./Provider";

const Splitter = (props: {
    parentId: string;
    primaryId: string;
    secondaryId: string;
}) => {
    const { parentId, primaryId, secondaryId } = props;
    const [nodes, dispatch] = useNode();

    const [movingOffset, setMovingOffset] = useState(0);
    const [dragging, setDragging] = useState(false);

    const ref = useRef<HTMLDivElement>(null);
    const shadowRef = useRef<HTMLDivElement>(null);

    const dnd = useDnd();

    const parent = useMemo(() => selectById(nodes, parentId), [
        nodes,
        parentId,
    ]);

    const primary = useMemo(() => selectById(nodes, primaryId), [
        nodes,
        primaryId,
    ]);

    const secondary = useMemo(() => selectById(nodes, secondaryId), [
        nodes,
        secondaryId,
    ]);

    const primaryOffsetRef = useRef(0);

    const secondaryOffsetRef = useRef(0);

    useEffect(() => {
        if (primary?.offset != null) {
            primaryOffsetRef.current = primary?.offset;
        }
    }, [primary?.offset]);

    useEffect(() => {
        if (secondary?.offset != null) {
            secondaryOffsetRef.current = secondary?.offset;
        }
    }, [secondary?.offset]);

    const splitterStyle: CSSProperties = useMemo(() => {
        const parentDirection = parent?.direction;
        const hoverBackgroundColor = "#00000085";
        return {
            width: parentDirection === DIRECTION.ROW ? 10 : "100%",
            height: parentDirection === DIRECTION.ROW ? "100%" : 10,
            backgroundColor: dragging ? hoverBackgroundColor : "#00000065",
            userSelect: "none",
        };
    }, [dragging, parent]);

    const shadowStyle = useMemo(() => {
        const parentDirection = parent?.direction;

        let x = parentDirection === DIRECTION.ROW ? movingOffset : 0;
        let y = parentDirection === DIRECTION.ROW ? 0 : movingOffset;
        const transform = `translate(${x}px, ${y}px)`;
        return {
            display: dragging ? undefined : "none",
            position: "relative",
            zIndex: 1,
            transform,
            width: "100%",
            height: "100%",
            backgroundColor: "#00000065",
        } as CSSProperties;
    }, [dragging, movingOffset, parent]);

    useEffect(() => {
        let offset = 0;
        const listenable = dnd
            .draggable(ref.current!, false, {
                item: {
                    id: `${parentId}-${primaryId}-${secondaryId}`,
                },
            })
            .addListener(DND_EVENT.DRAG_START, (data) => {
                setDragging(true);
            })
            .addListener(DND_EVENT.DRAG_END, (data) => {
                setDragging(false);
                setMovingOffset(0);
                dispatch(
                    updateMany([
                        {
                            id: primaryId,
                            changes: {
                                offset: primaryOffsetRef.current + offset,
                            },
                        },
                        {
                            id: secondaryId,
                            changes: {
                                offset: secondaryOffsetRef.current - offset,
                            },
                        },
                    ])
                );
            })
            .addListener(DND_EVENT.DRAG, (data) => {
                offset =
                    parent?.direction === DIRECTION.ROW
                        ? data.offset.x
                        : data.offset.y;
                if (
                    ref.current != null &&
                    shadowRef.current != null &&
                    primary?.width != null &&
                    primary.height != null &&
                    secondary?.width != null &&
                    secondary.height != null
                ) {
                    let velocity = 0;
                    let primaryValue = 0;
                    let secondaryValue = 0;
                    if (parent?.direction === DIRECTION.ROW) {
                        primaryValue = primary.width;
                        secondaryValue = secondary.width;
                        velocity = data.vector.x;
                    } else {
                        primaryValue = primary.height;
                        secondaryValue = secondary.height;
                        velocity = data.vector.y;
                    }

                    if (velocity >= 0 && secondaryValue - offset < 100) {
                        offset = secondaryValue - 100;
                    }

                    if (velocity <= 0 && primaryValue + offset < 100) {
                        offset = -(primaryValue - 100);
                    }

                    if (velocity >= 0 && primaryValue + offset < 100) {
                        offset = -(primaryValue - 100);
                    }

                    if (velocity <= 0 && secondaryValue - offset < 100) {
                        offset = secondaryValue - 100;
                    }
                    setMovingOffset(offset);
                }
            });
        return () => {
            listenable.removeAllListeners();
        };
    }, [
        dispatch,
        dnd,
        parent,
        parentId,
        primary,
        primaryId,
        secondary,
        secondaryId,
    ]);

    return (
        <div ref={ref} style={splitterStyle}>
            <div ref={shadowRef} style={shadowStyle}></div>
        </div>
    );
};

export default Splitter;
