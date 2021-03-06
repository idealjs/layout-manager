import { useSplitter } from "components/providers/SplittersProvider";
import useSplitterRef, {
    createShadowStyle,
    createSplitterStyle,
} from "hooks/useSplitterRef";
import { useMemo } from "react";
import { SplitterCMPT } from "src/type";

import { useLayout } from "./providers/LayoutsProvider";

const DefaultSplitter: SplitterCMPT = (props) => {
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
        return createSplitterStyle({
            dragging,
        });
    }, [dragging]);

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

export default DefaultSplitter;
