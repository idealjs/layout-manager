import { CSSProperties, forwardRef, useCallback } from "react";
import { TABCMPT } from "@idealjs/layout-manager";

import Close from "../svg/Close";
import Pop from "../svg/Popout";
import { usePopout } from "./Popout";
import { uniqueId } from "lodash";

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
    marginLeft: "4px",
    marginRight: "2px",
    "&:hover": {
        backgroundColor: "#00000025",
    },
    width: "16px",
    height: "16px",
};

const CustomTab: TABCMPT = forwardRef((props, ref) => {
    const { nodeId, nodeTitle, onClose, onSelect } = props;
    const { setPortalState } = usePopout();
    const onPopout = useCallback(() => {
        console.log("[Debug] popout");
        setPortalState((s) => [...s, uniqueId()]);
    }, [setPortalState]);
    return (
        <div id={nodeId} className={"Tab"} style={root}>
            <div
                ref={ref}
                style={{ lineHeight: "100%", textAlign: "center" }}
                onClick={onSelect}
            >
                {nodeTitle}
            </div>
            <div style={close} onClick={onPopout}>
                <Pop />
            </div>
            <div style={close} onClick={onClose}>
                <Close />
            </div>
        </div>
    );
});

export default CustomTab;
