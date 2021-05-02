import { useCallback, useEffect, useRef } from "react";

import { SLOT_EVENT } from "../enum";
import { useDnd } from "../lib/dnd";
import { REMOVE_PANEL_DATA, SELECT_TAB_DATA } from "../lib/type";
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
        sns.send(layoutSymbol, SLOT_EVENT.SELECT_TAB, {
            selected: nodeId,
        } as SELECT_TAB_DATA);
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
        sns.send(layoutSymbol, SLOT_EVENT.REMOVE_PANEL, {
            search: nodeId,
        } as REMOVE_PANEL_DATA);
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
