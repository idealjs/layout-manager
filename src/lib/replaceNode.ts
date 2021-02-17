import { EntityState } from "@reduxjs/toolkit";

import { ILayoutNode, IPanelNode } from "../reducer/type";
import immutableSplice from "./immutableSplice";

const replaceNode = (
    layoutNodes: EntityState<ILayoutNode>,
    panelNodes: EntityState<IPanelNode>,
    searchNodeId: string,
    replaceNodeId: string,
    keepOffset: boolean = true
): [EntityState<ILayoutNode>, EntityState<IPanelNode>] => {
    console.debug("[Info] replaceNode", searchNodeId, replaceNodeId);

    let nextLayoutNodes = layoutNodes;
    let nextPanelNodes = panelNodes;

    return [nextLayoutNodes, nextPanelNodes];
    // let nextState = state;
    // const searchNode = selectById(nextState, searchNodeId);
    // if (searchNode?.parentId != null) {
    //     const searchParent = selectById(nextState, searchNode.parentId);
    //     if (searchParent?.children != null) {
    //         const index = searchParent.children.findIndex(
    //             (childId) => childId === searchNodeId
    //         );
    //         if (index !== -1) {
    //             nextState = adapter.updateMany(nextState, [
    //                 {
    //                     id: replaceNodeId,
    //                     changes: {
    //                         parentId: searchNode.parentId,
    //                         offset: keepOffset ? searchNode.offset : 0,
    //                     },
    //                 },
    //                 {
    //                     id: searchNode.parentId,
    //                     changes: {
    //                         children: immutableSplice(
    //                             searchParent.children,
    //                             index,
    //                             1,
    //                             replaceNodeId
    //                         ),
    //                     },
    //                 },
    //             ]);
    //         }
    //     }
    // }
    // return nextState;
};

export default replaceNode;
