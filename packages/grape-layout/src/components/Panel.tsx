import { MASK_PART } from "@idealjs/layout-manager";
import { CSSProperties, useMemo } from "react";

import { useFactory } from "../features/Provider";
import { usePanel } from "../features/Provider/ValtioStateProvider";
import usePanelRef from "../hooks/usePanelRef";

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

const Panel = (props: { nodeId: string }) => {
    const { nodeId } = props;
    const panel = usePanel(nodeId)!;

    const hidden = useMemo(() => !panel.selected, [panel.selected]);
    const [ref, maskPart] = usePanelRef(nodeId);

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

    const node = usePanel(nodeId);
    const factory = useFactory();
    const Page = useMemo(
        () => factory(node?.page!, node?.data),
        [factory, node?.data, node?.page]
    );

    return (
        <div
            ref={ref}
            id={panel.id}
            key={panel.id}
            style={{
                position: "absolute",
                height: panel.height,
                width: panel.width,
                left: panel.left,
                top: panel.top,

                overflow: "hidden",
                backgroundColor: "#dcdcdd",
                visibility: hidden ? "hidden" : undefined,
            }}
        >
            <div style={maskPartStyle} />
            {Page ? <Page nodeData={node?.data} /> : null}
        </div>
    );
};

export default Panel;
