import { useLayoutNode } from "components/providers/LayoutNodeProvider";
import { useLayouts } from "components/providers/LayoutsProvider";
import { useLayoutSymbol } from "components/providers/LayoutSymbolProvider";
import { usePanels } from "components/providers/PanelsProvider";
import { useSplitters } from "components/providers/SplittersProvider";
import { useUpdateHook } from "components/providers/UpdateHookProvider";
import { useCallback } from "react";
import { setAll as setAllLayouts } from "reducers/layouts";
import { setAll as setAllPanels } from "reducers/panels";
import { setAll as setAllSplitters } from "reducers/splitters";

const useUpdate = (
    rect?: {
        height: number;
        width: number;
    }
) => {
    const layoutSymbol = useLayoutSymbol();
    const layoutNode = useLayoutNode();
    const hook = useUpdateHook();
    const [, , dispatchSplitters] = useSplitters();
    const [, , dispatchLayouts] = useLayouts();
    const [, , dispatchPanels] = usePanels();

    return useCallback(() => {
        hook?.before && hook.before(layoutSymbol, layoutNode)
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
        dispatchLayouts(setAllLayouts(layouts));
        dispatchSplitters(setAllSplitters(splitters));
        dispatchPanels(setAllPanels(panels));
        hook?.after && hook.after(layoutSymbol, layoutNode)
    }, [dispatchLayouts, dispatchPanels, dispatchSplitters, hook, layoutNode, layoutSymbol, rect]);
};

export default useUpdate;
