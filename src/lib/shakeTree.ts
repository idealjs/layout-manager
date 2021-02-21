import { EntityState } from "@reduxjs/toolkit";

import { ROOTID } from "../constant";
import { removeNode, selectById } from "../reducer/layouts";
import { ILayoutNode } from "../reducer/type";
import outwardMigration from "./outwardMigration";

const shakeTree = (nodes: EntityState<ILayoutNode>, nodeId: string) => {
    let nextState = nodes;

    let node = selectById(nextState, nodeId);
    if (node == null) {
        return nextState;
    }

    console.debug("[Info] shakeTree start", nodeId);

    // do recursive tree shake
    nextState = node.children.reduce((previousValue, currentValue) => {
        const s = shakeTree(previousValue, currentValue);
        return s;
    }, nextState);

    // reselect node after tree shake.
    node = selectById(nextState, nodeId);
    if (nodeId === ROOTID || node == null) {
        return nextState;
    }

    let parent = selectById(nextState, node.parentId);

    // remove layout if there is no widget
    parent = selectById(nextState, node.parentId);
    console.log(node.id, node.children.length);
    if (node.children.length === 0) {
        nextState = removeNode(nextState, nodeId);
        console.log("test", nextState);
    }

    // move children outward if node direction is same as parent;
    parent = selectById(nextState, node.parentId);
    if (node.direction === parent?.direction) {
        nextState = outwardMigration(nextState, nodeId);
    }

    // replace node if node is layoutnode & only has one layoutnode as child
    if (parent?.id !== ROOTID && node?.children?.length === 1) {
        nextState = outwardMigration(nextState, node.children[0]);
    }

    // // change offset if root only has one node
    // let root = selectById(nextState, ROOTID);
    // if (node?.parentId === ROOTID && root?.children?.length === 1) {
    //     nextState = adapter.updateOne(nextState, {
    //         id: nodeId,
    //         changes: {
    //             offset: 0,
    //         },
    //     });
    // }

    // console.debug("[Info] shakeTree end", nodeId);

    return nextState;
};

export default shakeTree;
