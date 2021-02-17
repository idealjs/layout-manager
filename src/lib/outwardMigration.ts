import { EntityState } from "@reduxjs/toolkit";

import { ILayoutNode, IPanelNode } from "../reducer/type";
import immutableSplice from "./immutableSplice";

const outwardMigration = (
    layoutNodes: EntityState<ILayoutNode>,
    panelNodes: EntityState<IPanelNode>,
    nodeId: string
): [EntityState<ILayoutNode>, EntityState<IPanelNode>] => {
    console.debug("[Info] outwardMigration", nodeId);
    let nextLayoutNodes = layoutNodes;
    let nextPanelNodes = panelNodes;

    return [nextLayoutNodes, nextPanelNodes];

    // let node = selectById(nextState, nodeId);
    // if (node == null || node.children == null) {
    //     return nextState;
    // }
    // let parent = selectById(nextState, node.parentId);
    // if (parent == null || parent.children == null) {
    //     return nextState;
    // }
    // const index = parent.children.findIndex((childId) => childId === nodeId);

    // const eachOffset =
    //     node.offset != null ? node.offset / node.children.length : 0;

    // for (const childId of node.children) {
    //     const child = selectById(nextState, childId);
    //     const childOffset = child?.offset != null ? child?.offset : 0;
    //     nextState = adapter.updateOne(nextState, {
    //         id: childId,
    //         changes: {
    //             parentId: node.parentId,
    //             offset: childOffset + eachOffset,
    //         },
    //     });
    // }

    // nextState = adapter.updateOne(nextState, {
    //     id: node.parentId,
    //     changes: {
    //         children: immutableSplice(parent.children, index, 1, node.children),
    //     },
    // });
};

export default outwardMigration;
