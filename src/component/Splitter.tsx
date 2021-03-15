import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";

import { SLOT_EVENT } from "../enum";
import { DND_EVENT, useDnd } from "../lib/dnd";
import { IDragData } from "../lib/dnd/type";
import { LAYOUT_DIRECTION } from "../reducer/type";
import { useLayout, useLayouts } from "./Provider/LayoutsProvider";
import { useLayoutSymbol } from "./Provider/LayoutSymbolProvider";
import { useSns } from "./Provider/SnsProvider";

const Splitter = (props: {
    id: string;
    parentId: string;
    primaryId: string;
    secondaryId: string;
}) => {
    const { id, parentId, primaryId, secondaryId } = props;

    const [, , dispatch] = useLayouts();

    const [movingOffset, setMovingOffset] = useState(0);
    const [dragging, setDragging] = useState(false);

    const ref = useRef<HTMLDivElement>(null);
    const shadowRef = useRef<HTMLDivElement>(null);

    const dnd = useDnd();

    const parent = useLayout(parentId);

    const primary = useLayout(primaryId);

    const secondary = useLayout(secondaryId);

    const layoutSymbol = useLayoutSymbol();

    const sns = useSns();

    const offsetRef = useRef(0);

    useEffect(() => {
        if (primary?.secondaryOffset != null) {
            offsetRef.current = primary.secondaryOffset;
        }
    }, [primary?.secondaryOffset]);

    const splitterStyle: CSSProperties = useMemo(() => {
        const hoverBackgroundColor = "#00000085";
        return {
            width: "100%",
            height: "100%",
            backgroundColor: dragging ? hoverBackgroundColor : "#00000065",
            userSelect: "none",
            position: "relative",
            zIndex: 1,
        };
    }, [dragging]);

    const shadowStyle = useMemo(() => {
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
    }, [dragging, movingOffset, parent]);

    useEffect(() => {
        let offset = 0;
        const onDragStart = () => {
            setDragging(true);
        };
        const onDragEnd = () => {
            sns.send(layoutSymbol, SLOT_EVENT.MOVE_SPLITTER, {
                primaryId,
                secondaryId,
                offset,
            });
            setDragging(false);
            setMovingOffset(0);
        };
        const onDrag = (data: IDragData) => {
            offset =
                parent?.direction === LAYOUT_DIRECTION.ROW
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
                if (parent?.direction === LAYOUT_DIRECTION.ROW) {
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
        };
        const listenable = dnd
            .draggable(ref.current!, true, {
                item: {
                    id: id,
                },
            })
            .addListener(DND_EVENT.DRAG_START, onDragStart)
            .addListener(DND_EVENT.DRAG_END, onDragEnd)
            .addListener(DND_EVENT.DRAG, onDrag);
        return () => {
            listenable
                .removeListener(DND_EVENT.DRAG_START, onDragStart)
                .removeListener(DND_EVENT.DRAG_END, onDragEnd)
                .removeListener(DND_EVENT.DRAG, onDrag);
        };
    }, [
        dispatch,
        dnd,
        id,
        layoutSymbol,
        parent,
        parentId,
        primary,
        primaryId,
        secondary,
        secondaryId,
        sns,
    ]);

    return (
        <div id={id} ref={ref} style={splitterStyle}>
            <div ref={shadowRef} style={shadowStyle}></div>
        </div>
    );
};

export default Splitter;
