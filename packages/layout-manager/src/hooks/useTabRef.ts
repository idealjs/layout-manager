import { useEffect, useRef } from "react";

import { useLayoutSymbol } from "../components/providers/LayoutSymbolProvider";
import { usePanel } from "../components/providers/PanelsProvider";
import { useDnd } from "../lib/dnd";

const useTabRef = (nodeId: string) => {

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
    return ref;
}

export default useTabRef;
