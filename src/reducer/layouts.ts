import {
    createEntityAdapter,
    createSlice,
    EntityState,
} from "@reduxjs/toolkit";

import immutableSplice from "../lib/immutableSplice";
import { ILayoutNode } from "./type";

export const adapter = createEntityAdapter<ILayoutNode>();

const slice = createSlice({
    name: "layouts",
    initialState: adapter.getInitialState(),
    reducers: {
        updateMany: adapter.updateMany,
        setAll: adapter.setAll,
    },
});

export const { selectById, selectAll } = adapter.getSelectors();

export const { updateMany, setAll } = slice.actions;

export default slice.reducer;

export const removeNode = (nodes: EntityState<ILayoutNode>, nodeId: string) => {
    console.debug("[Info] remove layoutNode", nodeId);
    let nextState = nodes;
    const node = selectById(nextState, nodeId);
    const primaryOffset = node?.primaryOffset || 0;
    const secondaryOffset = node?.secondaryOffset || 0;
    if (node == null) {
        return nextState;
    }
    const parent = selectById(nextState, node?.parentId);
    if (parent == null) {
        //if has no parent must be root
        return nextState;
    }

    const index = parent.children.findIndex((childId) => childId === nodeId);
    if (index === -1) {
        throw new Error("node has parent,but didn't find in parent's children");
    }
    const primaryNodeId: string | undefined = parent.children[index - 1];
    const secondaryNodeId: string | undefined = parent.children[index + 1];
    const primaryNode = selectById(nextState, primaryNodeId);
    const secondaryNode = selectById(nextState, secondaryNodeId);
    if (primaryNode != null) {
        nextState = adapter.updateOne(nextState, {
            id: primaryNodeId,
            changes: {
                secondaryOffset: primaryNode.secondaryOffset + primaryOffset,
            },
        });
    }
    if (secondaryNode != null) {
        nextState = adapter.updateOne(nextState, {
            id: secondaryNodeId,
            changes: {
                primaryOffset: secondaryNode.primaryOffset + secondaryOffset,
            },
        });
    }
    nextState = removeChild(nextState, parent.id, nodeId);
    nextState = adapter.removeOne(nextState, nodeId);
    return nextState;
};

export const removeChild = (
    nodes: EntityState<ILayoutNode>,
    targetNodeId: string,
    nodeId: string
) => {
    let nextState = nodes;
    const targetNode = selectById(nextState, targetNodeId);
    if (targetNode == null) {
        throw new Error("targetNode not found");
    }
    const index = targetNode.children.findIndex(
        (childId) => childId === nodeId
    );
    if (index === -1) {
        throw new Error("didn't find node in target node");
    }
    console.log(
        targetNodeId,
        nodeId,
        immutableSplice(targetNode.children, index, 1, [])
    );
    nextState = adapter.updateOne(nextState, {
        id: targetNodeId,
        changes: {
            children: immutableSplice(targetNode.children, index, 1, []),
        },
    });
    return nextState;
};

export const addNode = () => {};
