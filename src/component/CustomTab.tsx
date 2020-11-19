import React, { CSSProperties, forwardRef } from "react";

import Close from "../svg/Close";

const root: CSSProperties = {
    touchAction: "none",
    backgroundColor: "#00000025",
    display: "flex",
    alignItems: "center",
    borderStyle: "solid",
    borderWidth: "thin",
    margin: "2px",
    userSelect: "none",
};
const close = {
    "&:hover": {
        backgroundColor: "#00000025",
    },
    width: "20px",
    height: "20px",
};

const CustomTab = forwardRef<
    HTMLDivElement,
    {
        nodeId: string;
        nodeTitle: string;
        onClose: () => void;
        onSelect: () => void;
    }
>((props, ref) => {
    const { nodeId, nodeTitle, onClose, onSelect } = props;

    return (
        <div id={nodeId} ref={ref} className={"Tab"} style={root}>
            <div
                style={{ lineHeight: "100%", textAlign: "center" }}
                onClick={onSelect}
            >
                {nodeTitle}
            </div>
            <div style={close} onClick={onClose}>
                <Close />
            </div>
        </div>
    );
});

export default CustomTab;
