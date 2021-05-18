import { useLayoutNode } from "components/providers/LayoutNodeProvider";
import { useLayouts } from "components/providers/LayoutsProvider";
import { usePanels } from "components/providers/PanelsProvider";
import { useSplitters } from "components/providers/SplittersProvider";
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
    const layoutNode = useLayoutNode();

    const [, , dispatchSplitters] = useSplitters();
    const [, , dispatchLayouts] = useLayouts();
    const [, , dispatchPanels] = usePanels();

    return useCallback(() => {
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
    }, [dispatchLayouts, dispatchPanels, dispatchSplitters, layoutNode, rect]);
};

export default useUpdate;
