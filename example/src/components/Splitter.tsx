import { useLayout, useSplitter, useSplitterRef } from "@idealjs/grape-layout";
import { LAYOUT_DIRECTION, SplitterCMPT } from "@idealjs/layout-manager";
import clsx from "clsx";
import { useMemo } from "react";

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

    const isCOL = useMemo(
        () => parent?.direction === LAYOUT_DIRECTION.COL,
        [parent?.direction]
    );

    const transform = useMemo(() => {
        let x = parent?.direction === LAYOUT_DIRECTION.ROW ? movingOffset : 0;
        let y = parent?.direction === LAYOUT_DIRECTION.ROW ? 0 : movingOffset;
        const transform = `translate(${x}px, ${y}px)`;
        return transform;
    }, [movingOffset, parent?.direction]);

    const [height, width] = useMemo(() => {
        let { height, width } = splitter;
        if (splitter.height === 0) {
            height = 4;
        }
        if (splitter.width === 0) {
            width = 4;
        }
        return [height, width];
    }, [splitter]);

    return (
        <div
            id={id}
            ref={ref}
            className={clsx(
                "absolute select-none z-10 bg-slate-500 hover:bg-sky-600",
                {
                    "cursor-ew-resize": !isCOL,
                    "cursor-ns-resize": isCOL,
                }
            )}
            style={{
                height: height,
                width: width,
                left: !isCOL ? splitter.left - 4 : splitter.left,
                top: isCOL ? splitter.top - 4 : splitter.top,
            }}
        >
            <div
                ref={shadowRef}
                className={clsx("relative bg-sky-600 h-full w-full", {
                    hidden: !dragging,
                })}
                style={{ transform }}
            ></div>
        </div>
    );
};

export default Splitter;
