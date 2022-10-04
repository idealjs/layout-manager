import { useCallback } from "react";

import { useSplitterThickness, useTitlebarHeight } from "../features/Provider";
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

    const titlebarHeight = useTitlebarHeight();
    const splitterThickness = useSplitterThickness();

    const setAllLayouts = useSetAllLayouts();
    const setAllPanels = useSetAllPanels();
    const setAllSplitters = useSetAllSplitters();

    return useCallback(
        (rect: { height: number; width: number }) => {
            console.debug("[debug] update rect", rect);
            hook?.before && hook.before(layoutSymbol, layoutNode);
            layoutNode.shakeTree();
            if (rect != null) {
                layoutNode.fill(
                    { ...rect, left: 0, top: 0 },
                    splitterThickness
                );
            } else {
                layoutNode.fill(
                    {
                        height: layoutNode.height,
                        width: layoutNode.width,
                        left: layoutNode.left,
                        top: layoutNode.top,
                    },
                    splitterThickness
                );
            }
            const layouts = layoutNode.parseLayout();
            const splitters = layoutNode.parseSplitter(splitterThickness);
            const panels = layoutNode.parsePanel(titlebarHeight);

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
            splitterThickness,
            titlebarHeight,
        ]
    );
};

export default useUpdate;
