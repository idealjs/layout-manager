import {
    LayoutNodeActionType,
    MASK_PART,
    ROOTID,
    useLayoutNode,
    useSlot,
} from "@idealjs/layout-manager";
import { useEffect } from "react";

import { rules } from "../lib/constant";
import { useMainLayoutSymbol } from "./MainLayoutSymbolProvider";

const PopinListener = () => {
    const layoutNode = useLayoutNode();
    const mainlayoutSymbol = useMainLayoutSymbol();
    const slot = useSlot(mainlayoutSymbol);
    useEffect(() => {
        slot.addListener("popin", (e) => {
            console.log(e);
            try {
                const target = layoutNode.findNodeByRules(rules);
                console.debug("[Debug] target is", target);
                if (target) {
                    layoutNode.doAction(LayoutNodeActionType.ADD_PANEL, {
                        panelNode: e.panelNode,
                        mask: target.rule.part,
                        target: target.layoutNode,
                    });
                } else {
                    if (layoutNode.layoutNodes.length === 0) {
                        layoutNode.doAction(LayoutNodeActionType.ADD_PANEL, {
                            panelNode: e.panelNode,
                            mask: MASK_PART.CENTER,
                            target: ROOTID,
                        });
                    }
                }
            } catch (error) {
                console.error(error);
            }
        });
    }, [layoutNode, slot]);

    return null;
};

export default PopinListener;
