import { useEffect, useRef } from "react";

import { useDnd } from "../lib/dnd";
import { useCustomTab } from "./Provider";
import { useLayoutSymbol } from "./Provider/LayoutSymbolProvider";
import { usePanel } from "./Provider/PanelsProvider";

const Tab = (props: { nodeId: string }) => {
    const { nodeId } = props;

    const ref = useRef(null);

    const node = usePanel(nodeId);
    const dnd = useDnd();
    const layoutSymbol = useLayoutSymbol();

    useEffect(() => {
        try {
            const listenable = dnd.draggable(ref.current!, true, {
                item: {
                    layoutSymbol,
                    ...node!,
                    type: "Tab",
                },
            });
            return () => {
                listenable.removeAllListeners().removeEleListeners();
            };
        } catch (error) {
            console.error(error);
        }
    }, [dnd, layoutSymbol, node, nodeId]);

    const CustomTab = useCustomTab();

    return <CustomTab nodeId={nodeId} ref={ref} />;
};

export default Tab;
