import { Fragment, useCallback, useEffect, useMemo, useRef } from "react";

import { useDnd } from "../lib/dnd";
import { removeOne, updateOne } from "../reducer/panels";
import { useTab } from "./Provider";
import { useLayoutSymbol } from "./Provider/LayoutSymbolProvider";
import { usePanel, usePanels } from "./Provider/PanelsProvider";

const Tab = (props: {
    nodeId: string;
    selected: string;
    onSelect: (nodeId: string) => void;
}) => {
    const { nodeId, selected, onSelect } = props;
    const symbol = useMemo(() => Symbol(nodeId), [nodeId]);
    const ref = useRef(null);

    const [, , dispatch] = usePanels();
    const node = usePanel(nodeId);
    const dnd = useDnd();
    const layoutSymbol = useLayoutSymbol();
    const onClick = useCallback(() => {
        onSelect(nodeId);
    }, [nodeId, onSelect]);

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
                listenable.removeAllListeners();
            };
        } catch (error) {
            console.error(error);
        }
    }, [dnd, layoutSymbol, node, nodeId, symbol]);

    useEffect(() => {
        if (nodeId === selected) {
            dispatch(updateOne({ id: nodeId, changes: { selected: true } }));
        } else {
            dispatch(updateOne({ id: nodeId, changes: { selected: false } }));
        }
    }, [dispatch, nodeId, selected]);

    const closeTab = useCallback(() => {
        dispatch(removeOne(nodeId));
    }, [dispatch, nodeId]);
    const Tab = useTab();

    return (
        <Fragment>
            <Tab
                nodeId={nodeId}
                nodeTitle={nodeId}
                ref={ref}
                onSelect={onClick}
                onClose={closeTab}
            />
        </Fragment>
    );
};

export default Tab;
