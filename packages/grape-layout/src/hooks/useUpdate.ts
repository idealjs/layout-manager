import { useCallback } from "react";

import { useLayoutNode } from "../features/Provider/LayoutNodeProvider";
import { useLayoutSymbol } from "../features/Provider/LayoutSymbolProvider";
import { useUpdateHook } from "../features/Provider/UpdateHookProvider";
import {
    useSetAllLayouts,
    useSetAllPanels,
    useSetAllSplitters,
} from "../features/Provider/ValtioStateProvider";

const useUpdate = () => {
    const layoutSymbol = useLayoutSymbol();
    const layoutNode = useLayoutNode();
    const hook = useUpdateHook();

    const setAllLayouts = useSetAllLayouts();
    const setAllPanels = useSetAllPanels();
    const setAllSplitters = useSetAllSplitters();

    return useCallback(
        (rect: { height: number; width: number }) => {
            console.debug("[debug] update rect", rect);
            hook?.before && hook.before(layoutSymbol, layoutNode);
            layoutNode.shakeTree();
            if (rect != null) {
                layoutNode.fill({ ...rect, left: 0, top: 0 });
            } else {
                layoutNode.fill({
                    height: layoutNode.height,
                    width: layoutNode.width,
                    left: layoutNode.left,
                    top: layoutNode.top,
                });
            }
            const layouts = layoutNode.parseLayout();
            const splitters = layoutNode.parseSplitter();
            const panels = layoutNode.parsePanel();

            setAllLayouts(layouts);
            setAllPanels(panels);
            setAllSplitters(splitters);

            hook?.after && hook.after(layoutSymbol, layoutNode);
        },
        [
            hook,
            layoutNode,
            layoutSymbol,
            setAllLayouts,
            setAllPanels,
            setAllSplitters,
        ]
    );
};

export default useUpdate;
