import { useCallback } from "react";

import {
    useSplitterThickness,
    useTitlebarHeight,
} from "../components/Provider";
import { useLayoutNode } from "../components/providers/LayoutNodeProvider";
import { useLayoutSymbol } from "../components/providers/LayoutSymbolProvider";
import { useUpdateHook } from "../components/providers/UpdateHookProvider";
import { setAllLayouts } from "../stores/layouts";
import { setAllPanels } from "../stores/panels";
import { setAllSplitters } from "../stores/splitters";

const useUpdate = () => {
    const layoutSymbol = useLayoutSymbol();
    const layoutNode = useLayoutNode();
    const hook = useUpdateHook();

    const titlebarHeight = useTitlebarHeight();
    const splitterThickness = useSplitterThickness();

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
        [hook, layoutNode, layoutSymbol, splitterThickness, titlebarHeight]
    );
};

export default useUpdate;