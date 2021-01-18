import { useDnd } from "@idealjs/drag-drop";
import { Fragment, useCallback, useEffect, useMemo, useRef } from "react";

import { removeNode, shakeTree } from "../lib";
import { selectAll, selectById, setAll, updateOne } from "../reducer/nodes";
import { useNode, useTab } from "./Provider";

const Tab = (props: {
    nodeId: string;
    selected: string;
    onSelect: (nodeId: string) => void;
}) => {
    const { nodeId, selected, onSelect } = props;
    const ref = useRef(null);

    const [nodes, dispatch] = useNode();
    useEffect(() => {
        console.debug("update nodes", nodeId, nodes);
    }, [nodeId, nodes]);
    const dnd = useDnd();

    const node = useMemo(() => selectById(nodes, nodeId), [nodeId, nodes]);

    const onClick = useCallback(() => {
        onSelect(nodeId);
    }, [nodeId, onSelect]);

    useEffect(() => {
        const listenable = dnd.draggable(ref.current!, {
            id: nodeId,
            type: "Tab",
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
        console.log(nodes.ids.toString());

        let nextState = removeNode(nodes, nodeId);
        nextState = shakeTree(nextState, "root");
        console.log(nextState.ids.toString());
        console.log(
            selectAll(nextState)
                .map((n) => n.id)
                .toString()
        );
        dispatch(setAll(selectAll(nextState)));
    }, [dispatch, nodeId, nodes]);
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
