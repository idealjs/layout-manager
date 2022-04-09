import {
    LayoutNodeActionType,
    MASK_PART,
    PanelNode,
    ROOTID,
    useLayoutNode,
} from "@idealjs/layout-manager";
import { useSlot } from "@idealjs/sns";
import { useCallback, useEffect } from "react";

import { rules } from "../lib/constant";
import { useMainLayoutSymbol } from "./MainLayoutSymbolProvider";

const PopinListener = () => {
    const layoutNode = useLayoutNode();
    const mainlayoutSymbol = useMainLayoutSymbol();
    const slot = useSlot(mainlayoutSymbol);
    const popinListener = useCallback(
        (e: { panelNode: PanelNode }) => {
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
        },
        [layoutNode]
    );

    useEffect(() => {
        slot && slot.addListener("popin", popinListener);
        return () => {
            slot && slot.removeListener("popin", popinListener);
        };
    }, [layoutNode, popinListener, slot]);

    return null;
};

export default PopinListener;
