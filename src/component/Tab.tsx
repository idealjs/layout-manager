import { useDnd } from "@idealjs/drag-drop";
import { Fragment, useCallback, useEffect, useMemo, useRef } from "react";

import useRemoveNode from "../hook/useRemoveNode";
import { selectById, updateOne } from "../reducer/nodes";
import { useNode, useTab } from "./Provider";

const Tab = (props: {
    nodeId: string;
    selected: string;
    onSelect: (nodeId: string) => void;
}) => {
    const { nodeId, selected, onSelect } = props;
    const ref = useRef(null);

    const [nodes, dispatch] = useNode();
    const removeNode = useRemoveNode();
    useEffect(() => {
        console.debug("update nodes", nodeId, nodes);
    }, [nodeId, nodes]);
    const dnd = useDnd();

    const node = useMemo(() => selectById(nodes, nodeId), [nodeId, nodes]);

    const onClick = useCallback(() => {
        onSelect(nodeId);
    }, [nodeId, onSelect]);

    useEffect(() => {
        const listenable = dnd.draggable(ref.current!, true, {
            item: {
                id: nodeId,
                type: "Tab",
            },
        });
        return () => {
            listenable.removeAllListeners();
        };
    }, [dnd, nodeId]);

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
