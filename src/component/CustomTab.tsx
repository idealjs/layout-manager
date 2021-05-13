import { CSSProperties, forwardRef, useCallback } from "react";

import { SLOT_EVENT } from "../enum";
import { REMOVE_PANEL_DATA, SELECT_TAB_DATA } from "../lib/type";
import { TABCMPT } from "../reducer/type";
import Close from "../svg/Close";
import { useLayoutSymbol } from "./Provider/LayoutSymbolProvider";
import { useSns } from "./Provider/SnsProvider";

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

const CustomTab: TABCMPT = forwardRef((props, ref) => {
    const { nodeId } = props;

    const sns = useSns();
    const layoutSymbol = useLayoutSymbol();

    const onSelect = useCallback(() => {
        sns.send(layoutSymbol, SLOT_EVENT.SELECT_TAB, {
            selected: nodeId,
        } as SELECT_TAB_DATA);
    }, [layoutSymbol, nodeId, sns]);

    const onClose = useCallback(() => {
        sns.send(layoutSymbol, SLOT_EVENT.REMOVE_PANEL, {
            search: nodeId,
        } as REMOVE_PANEL_DATA);
    }, [layoutSymbol, nodeId, sns]);

    return (
        <div id={nodeId} className={"Tab"} style={root}>
            <div
                ref={ref}
                style={{ lineHeight: "100%", textAlign: "center" }}
                onClick={onSelect}
            >
                {nodeId}
            </div>
            <div style={close} onClick={onClose}>
                <Close />
            </div>
        </div>
    );
});

export default CustomTab;
