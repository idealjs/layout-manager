import { EntityState } from "@reduxjs/toolkit";

import { adapter, INode, NODE_TYPE, selectById } from "../reducer/nodes";
import outwardMigration from "./outwardMigration";
import removeNode from "./removeNode";
import replaceNode from "./replaceNode";

const shakeTree = (
    state: EntityState<INode>,
    nodeId: string
): EntityState<INode> => {
    let nextState = state;
    let node = selectById(nextState, nodeId);

    console.debug("[Info] shakeTree", nodeId);

    if (node?.children == null || node?.type === NODE_TYPE.PANEL) {
        return nextState;
    }

    // do recursive tree shake
    nextState = node.children.reduce((previousValue, currentValue) => {
        const s = shakeTree(previousValue, currentValue);
        return s;
    }, nextState);

    // reselect node after tree shake.
    node = selectById(nextState, nodeId);
    if (nodeId === "root" || node?.children == null) {
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
    if (node.children.length === 0 && node.type !== NODE_TYPE.PANEL) {
        nextState = removeNode(nextState, nodeId);
    }

    // move children outward if node only has one child;
    if (node.type === NODE_TYPE.LAYOUT_NODE && node.children.length === 1) {
        nextState = replaceNode(nextState, nodeId, node.children[0]);
        nextState = removeNode(nextState, nodeId);
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

    return nextState;
};

export default shakeTree;
