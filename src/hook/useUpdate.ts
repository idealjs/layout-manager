import { useCallback } from "react";

import { useLayouts } from "../component/Provider/LayoutsProvider";
import { usePanels } from "../component/Provider/PanelsProvider";
import { useSplitters } from "../component/Provider/SplittersProvider";
import LayoutNode from "../lib/LayoutNode";
import { setAll as setAllLayouts } from "../reducer/layouts";
import { setAll as setAllPanels } from "../reducer/panels";
import { setAll as setAllSplitters } from "../reducer/splitters";

const useUpdate = (
    layoutNode: LayoutNode,
    rect: {
        height: number;
        width: number;
    }
) => {
    const [, , dispatchSplitters] = useSplitters();
    const [, , dispatchLayouts] = useLayouts();
    const [, , dispatchPanels] = usePanels();
    return useCallback(() => {
        layoutNode.shakeTree();
        layoutNode.fill({ ...rect, left: 0, top: 0 });
        const layouts = layoutNode.parseLayout();
        const splitters = layoutNode.parseSplitter();
        const panels = layoutNode.parsePanel();
        dispatchLayouts(setAllLayouts(layouts));
        dispatchSplitters(setAllSplitters(splitters));
        dispatchPanels(setAllPanels(panels));
    }, [dispatchLayouts, dispatchPanels, dispatchSplitters, layoutNode, rect]);
};

export default useUpdate;
