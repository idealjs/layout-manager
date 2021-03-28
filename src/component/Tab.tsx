import { useCallback, useEffect, useRef } from "react";

import { SLOT_EVENT } from "../enum";
import { useDnd } from "../lib/dnd";
import { useCustomTab } from "./Provider";
import { useLayoutSymbol } from "./Provider/LayoutSymbolProvider";
import { usePanel } from "./Provider/PanelsProvider";
import { useSns } from "./Provider/SnsProvider";

const Tab = (props: { nodeId: string }) => {
    const { nodeId } = props;

    const ref = useRef(null);

    const node = usePanel(nodeId);
    const dnd = useDnd();
    const sns = useSns();
    const layoutSymbol = useLayoutSymbol();

    const onSelect = useCallback(() => {
        sns.send(layoutSymbol, SLOT_EVENT.SELECT_TAB, { id: nodeId });
    }, [layoutSymbol, nodeId, sns]);

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

    const closeTab = useCallback(() => {
        sns.send(layoutSymbol, SLOT_EVENT.REMOVE_PANEL, { searchId: nodeId });
    }, [layoutSymbol, nodeId, sns]);

    const CustomTab = useCustomTab();

    return (
        <CustomTab
            nodeId={nodeId}
            nodeTitle={nodeId}
            ref={ref}
            onSelect={onSelect}
            onClose={closeTab}
        />
    );
};

export default Tab;
