import { useDnd } from "@idealjs/drag-drop";
import { useEffect, useRef } from "react";

import { useLayoutSymbol } from "../components/providers/LayoutSymbolProvider";
import { usePanel } from "../components/providers/PanelsProvider";

const useTabRef = (nodeId: string) => {
    const ref = useRef(null);
    const node = usePanel(nodeId);
    const dnd = useDnd();
    const layoutSymbol = useLayoutSymbol();
    useEffect(() => {
        try {
            const listenable = dnd.draggable(ref.current!, {
                crossWindow: true,
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
    return ref;
};

export default useTabRef;
