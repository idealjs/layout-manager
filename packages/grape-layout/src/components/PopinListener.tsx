import {
    MASK_PART,
    ROOTID,
    useLayoutNode,
    useSlot,
    useUpdate,
} from "@idealjs/layout-manager";
import { useEffect } from "react";
import { rules } from "../lib/constant";
import { useMainLayoutSymbol } from "./MainLayoutSymbolProvider";

const PopinListener = () => {
    const layoutNode = useLayoutNode();
    const mainlayoutSymbol = useMainLayoutSymbol();
    const slot = useSlot(mainlayoutSymbol);
    const update = useUpdate(layoutNode);
    useEffect(() => {
        slot.addListener("popin", (e) => {
            console.log(e);
            try {
                const target = layoutNode.findNodeByRules(rules);
                console.debug("[Debug] target is", target);
                if (target) {
                    layoutNode.addPanelNode(
                        e.panelNode,
                        target.rule.part,
                        target.layoutNode
                    );
                } else {
                    if (layoutNode.layoutNodes.length === 0) {
                        layoutNode.addPanelNode(
                            e.panelNode,
                            MASK_PART.CENTER,
                            ROOTID
                        );
                    }
                }
                update();
            } catch (error) {
                console.error(error);
            }
        });
    }, [layoutNode, slot, update]);

    return null;
};

export default PopinListener;
