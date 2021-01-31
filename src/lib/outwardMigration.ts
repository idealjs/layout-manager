import { EntityState } from "@reduxjs/toolkit";

import { adapter, INode, selectById } from "../reducer/nodes";
import immutableSplice from "./immutableSplice";

const outwardMigration = (state: EntityState<INode>, nodeId: string) => {
    console.debug("[Info] outwardMigration", nodeId);
    let nextState = state;

    let node = selectById(nextState, nodeId);
    if (node == null || node.children == null) {
        return nextState;
    }
    let parent = selectById(nextState, node.parentId);
    if (parent == null || parent.children == null) {
        return nextState;
    }
    const index = parent.children.findIndex((childId) => childId === nodeId);

    const eachOffset =
        node.offset != null ? node.offset / node.children.length : 0;

    for (const childId of node.children) {
        const child = selectById(nextState, childId);
        const childOffset = child?.offset != null ? child?.offset : 0;
        nextState = adapter.updateOne(nextState, {
            id: childId,
            changes: {
                parentId: node.parentId,
                offset: childOffset + eachOffset,
            },
        });
    }

    nextState = adapter.updateOne(nextState, {
        id: node.parentId,
        changes: {
            children: immutableSplice(parent.children, index, 1, node.children),
        },
    });
    return nextState;
};

export default outwardMigration;
