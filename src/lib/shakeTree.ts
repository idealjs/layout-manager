import { EntityState } from "@reduxjs/toolkit";

import { adapter, INode, selectById } from "../reducer/nodes";
import isLayoutNode from "./isLayoutNode";
import outwardMigration from "./outwardMigration";
import removeNode from "./removeNode";
import replaceNode from "./replaceNode";

const shakeTree = (
    state: EntityState<INode>,
    nodeId: string
): EntityState<INode> => {
    let nextState = state;
    let node = selectById(nextState, nodeId);

    console.debug("[Info] shakeTree start", nodeId);

    if (!isLayoutNode(node)) {
        return nextState;
    }

    // do recursive tree shake
    nextState = node.children.reduce((previousValue, currentValue) => {
        const s = shakeTree(previousValue, currentValue);
        return s;
    }, nextState);

    // reselect node after tree shake.
    node = selectById(nextState, nodeId);
    if (nodeId === "root" || !isLayoutNode(node)) {
        return nextState;
    }

    // move children outward if node direction is same as parent;
    let parent = selectById(nextState, node.parentId);
    if (node.direction === parent?.direction) {
        nextState = outwardMigration(nextState, nodeId);
        nextState = removeNode(nextState, nodeId);
    }

    // remove layout if there is no widget
    parent = selectById(nextState, node.parentId);
    if (node.children.length === 0) {
        nextState = removeNode(nextState, nodeId);
    }

    // replace parent if parent is layoutnode & only has one layoutnode as child
    parent = selectById(nextState, node.parentId);
    if (parent?.id !== "root" && parent?.children?.length === 1) {
        nextState = replaceNode(nextState, parent.id, parent.children[0]);
        nextState = removeNode(nextState, parent?.id);
    }

    // change offset if root only has one node
    let root = selectById(nextState, "root");
    if (node?.parentId === "root" && root?.children?.length === 1) {
        nextState = adapter.updateOne(nextState, {
            id: nodeId,
            changes: {
                offset: 0,
            },
        });
    }

    console.debug("[Info] shakeTree end", nodeId);

    return nextState;
};

export default shakeTree;
