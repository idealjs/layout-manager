import { CSSProperties, forwardRef, useCallback } from "react";
import {
    MASK_PART,
    SLOT_EVENT,
    usePanel,
    TABCMPT,
    useSlot,
    useSns,
    PanelNode,
    ROOTID,
} from "@idealjs/layout-manager";

import Close from "../svg/Close";
import Pop from "../svg/Popout";
import { usePopout } from "./PopoutManager";
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
    const sns = useSns();
    const slot = useSlot(nodeId);

    const panel = usePanel(nodeId);

    const popoutReady = useCallback(
        (data: { layoutSymbol: string | number }) => {
            console.debug("[Debug] popout ready", data);
            console.log("test test", panel);
            const panelNode = new PanelNode({
                panelJSON: panel!,
            });
            slot.removeListener("ready", popoutReady);
            sns.send(data.layoutSymbol, SLOT_EVENT.ADD_PANEL, {
                panelNode: panelNode,
                mask: MASK_PART.CENTER,
                targetId: ROOTID,
            });
        },
        [panel, slot, sns]
    );

    const onPopout = useCallback(() => {
        console.debug("[Debug] popout");
        slot.addListener("ready", popoutReady);
        setPortalState((s) => {
            return [...s, uniqueId()];
        });
    }, [popoutReady, setPortalState, slot]);
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
