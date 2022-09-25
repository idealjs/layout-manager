import { DND_EVENT, IPoint, useDnd } from "@idealjs/dnd-react";
import { useEffect, useRef } from "react";

import { useLayoutSymbol } from "../components/providers/LayoutSymbolProvider";
import { usePanel } from "../components/providers/ValtioStateProvider";

const useTabRef = <T extends HTMLElement>(
    nodeId: string,
    popout?: (screen?: IPoint) => void
) => {
    const ref = useRef(null);
    const node = usePanel(nodeId);
    const dnd = useDnd();
    const layoutSymbol = useLayoutSymbol();
    useEffect(() => {
        try {
            const listenable = dnd
                .draggable<
                    T,
                    {
                        layoutSymbol: string | number;
                        id?: string;
                        page?: string;
                        data?: any;
                        type: string;
                    }
                >(ref.current!, {
                    crossWindow: true,
                    item: {
                        layoutSymbol,
                        id: node?.id,
                        page: node?.page,
                        data: node?.data,
                        type: "Tab",
                    },
                })
                .addListener(DND_EVENT.DRAG_END, (payload) => {
                    if (payload.dropOut) {
                        popout && popout(payload.screen);
                    }
                });
            return () => {
                listenable.removeEleListeners();
            };
        } catch (error) {
            console.error(error);
        }
    }, [dnd, layoutSymbol, node?.data, node?.id, node?.page, nodeId, popout]);
    return ref;
};

export default useTabRef;
