import { EntityState } from "@reduxjs/toolkit";

import { adapter, removeNode, selectById } from "../reducer/layouts";
import { ILayoutNode } from "../reducer/type";
import immutableSplice from "./immutableSplice";

const outwardMigration = (nodes: EntityState<ILayoutNode>, nodeId: string) => {
    console.debug("[Info] outwardMigration", nodeId);
    let nextState = nodes;

    const node = selectById(nextState, nodeId);
    if (node == null) {
        return nextState;
    }

    const parent = selectById(nextState, node.parentId);
    if (parent == null) {
        return nextState;
    }
    const index = parent.children.findIndex((childId) => childId === nodeId);
    if (index === -1) {
        throw new Error("node has parent,but didn't find in parent's children");
    }

    node.children.forEach((childId, index, array) => {
        const child = selectById(nextState, childId);
        if (child === null) {
            throw new Error(
                "childId found in parent's children,but node not found"
            );
        }

        nextState = adapter.updateOne(nextState, {
            id: childId,
            changes: {
                parentId: node.parentId,
            },
        });

        if (index === 0) {
            nextState = adapter.updateOne(nextState, {
                id: childId,
                changes: {
                    parentId: node.parentId,
                    primaryOffset: node.primaryOffset,
                },
            });
        }

        if (index === array.length - 1) {
            nextState = adapter.updateOne(nextState, {
                id: childId,
                changes: {
                    secondaryOffset: node.secondaryOffset,
                },
            });
        }
    });

    nextState = adapter.updateOne(nextState, {
        id: node.parentId,
        changes: {
            children: immutableSplice(parent.children, index, 1, node.children),
        },
    });

    nextState = removeNode(nextState, nodeId);

    return nextState;
};

export default outwardMigration;
