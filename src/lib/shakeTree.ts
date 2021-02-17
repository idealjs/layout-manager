import { EntityState } from "@reduxjs/toolkit";

import { ROOTID } from "../constant";
import { adapter, selectById } from "../reducer/layouts";
import { ILayoutNode, IPanelNode } from "../reducer/type";
import outwardMigration from "./outwardMigration";
import removeNode from "./removeNode";
import replaceNode from "./replaceNode";

const shakeTree = (
    layoutNodes: EntityState<ILayoutNode>,
    panelNodes: EntityState<IPanelNode>,
    nodeId: string
): [EntityState<ILayoutNode>, EntityState<IPanelNode>] => {
    let nextLayoutNodes = layoutNodes;
    let nextPanelNodes = panelNodes;

    // let node = selectById(nextState, nodeId);
    // if (node == null) {
    //     return nextState;
    // }

    // console.debug("[Info] shakeTree start", nodeId);

    // // do recursive tree shake
    // nextState = node.children.reduce((previousValue, currentValue) => {
    //     const s = shakeTree(previousValue, currentValue);
    //     return s;
    // }, nextState);

    // // reselect node after tree shake.
    // node = selectById(nextState, nodeId);
    // if (nodeId === ROOTID || node == null) {
    //     return nextState;
    // }

    // let parent = selectById(nextState, node.parentId);

    // // remove layout if there is no widget
    // parent = selectById(nextState, node.parentId);
    // if (node.children.length === 0) {
    //     nextState = removeNode(nextState, nodeId);
    // }

    // // move children outward if node direction is same as parent;
    // parent = selectById(nextState, node.parentId);
    // if (node.direction === parent?.direction) {
    //     nextState = outwardMigration(nextState, nodeId);
    //     nextState = removeNode(nextState, nodeId);
    //     nextState = shakeTree(nextState, parent.id);
    // }

    // // replace parent if parent is layoutnode & only has one layoutnode as child
    // parent = selectById(nextState, node.parentId);
    // if (parent?.id !== ROOTID && parent?.children?.length === 1) {
    //     nextState = replaceNode(nextState, parent.id, parent.children[0]);
    //     nextState = removeNode(nextState, parent?.id);
    //     nextState = shakeTree(nextState, parent.children[0]);
    // }

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

    return [nextLayoutNodes, nextPanelNodes];
};

export default shakeTree;
