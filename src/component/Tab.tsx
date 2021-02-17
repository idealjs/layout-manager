import { useDnd } from "@idealjs/drag-drop";
import { Fragment, useCallback, useEffect, useRef } from "react";

import useRemoveNode from "../hook/useRemoveNode";
import { updateOne } from "../reducer/panels";
import { useTab } from "./Provider";
import { usePanel, usePanels } from "./Provider/PanelsProvider";

const Tab = (props: {
    nodeId: string;
    selected: string;
    onSelect: (nodeId: string) => void;
}) => {
    const { nodeId, selected, onSelect } = props;
    const ref = useRef(null);

    const removeNode = useRemoveNode();
    const [, , dispatch] = usePanels();
    const node = usePanel(nodeId);
    const dnd = useDnd();

    const onClick = useCallback(() => {
        onSelect(nodeId);
    }, [nodeId, onSelect]);

    useEffect(() => {
        const listenable = dnd.draggable(ref.current!, true, {
            item: {
                id: nodeId,
                page: node?.page,
                type: "Tab",
            },
        });
        return () => {
            listenable.removeAllListeners();
        };
    }, [dnd, node?.page, nodeId]);

    useEffect(() => {
        if (nodeId === selected) {
            dispatch(updateOne({ id: nodeId, changes: { selected: true } }));
        } else {
            dispatch(updateOne({ id: nodeId, changes: { selected: false } }));
        }
    }, [dispatch, nodeId, selected]);

    const closeTab = useCallback(() => {
        removeNode(nodeId);
    }, [nodeId, removeNode]);
    const Tab = useTab();

    return (
        <Fragment>
            <Tab
                nodeId={nodeId}
                nodeTitle={node?.id!}
                ref={ref}
                onSelect={onClick}
                onClose={closeTab}
            />
        </Fragment>
    );
};

export default Tab;
