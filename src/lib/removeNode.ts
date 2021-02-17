import { EntityState } from "@reduxjs/toolkit";

import { ILayoutNode, IPanelNode } from "../reducer/type";

const removeNode = (
    layoutNodes: EntityState<ILayoutNode>,
    panelNodes: EntityState<IPanelNode>,
    nodeId: string,
    keepOffset: boolean = true
): [EntityState<ILayoutNode>, EntityState<IPanelNode>] => {
    let nextLayoutNodes = layoutNodes;
    let nextPanelNodes = panelNodes;

    return [nextLayoutNodes, nextPanelNodes];
    // let nextState = state;
    // console.debug("[Info] removeNode", nodeId);
    // const node = selectById(state, nodeId);
    // if (node?.parentId != null) {
    //     const parent = selectById(nextState, node?.parentId);
    //     if (parent?.children != null) {
    //         //update borther's offset before node removed.
    //         if (keepOffset) {
    //             const index = parent.children.findIndex(
    //                 (childId) => childId === nodeId
    //             );
    //             if (index !== -1) {
    //                 const prevNodeId = parent.children[index - 1];
    //                 const nextNodeId = parent.children[index + 1];
    //                 // has both brother,avg the offset
    //                 if (prevNodeId != null && nextNodeId != null) {
    //                     const prevNode = selectById(nextState, prevNodeId);
    //                     if (prevNode != null) {
    //                         nextState = adapter.updateOne(nextState, {
    //                             id: prevNodeId,
    //                             changes: {
    //                                 offset:
    //                                     (prevNode.offset || 0) +
    //                                     (node.offset || 0) / 2,
    //                             },
    //                         });
    //                     }
    //                     const nextNode = selectById(nextState, nextNodeId);
    //                     if (nextNode != null) {
    //                         nextState = adapter.updateOne(nextState, {
    //                             id: nextNodeId,
    //                             changes: {
    //                                 offset:
    //                                     (nextNode.offset || 0) +
    //                                     (node.offset || 0) / 2,
    //                             },
    //                         });
    //                     }
    //                 }

    //                 // only has one brother, remove borther's offset
    //                 if (prevNodeId != null && nextNodeId == null) {
    //                     const prevNode = selectById(nextState, prevNodeId);
    //                     if (prevNode != null) {
    //                         nextState = adapter.updateOne(nextState, {
    //                             id: prevNodeId,
    //                             changes: {
    //                                 offset:
    //                                     (prevNode.offset || 0) +
    //                                     (node.offset || 0),
    //                             },
    //                         });
    //                     }
    //                 }
    //                 if (prevNodeId == null && nextNodeId != null) {
    //                     const nextNode = selectById(nextState, nextNodeId);
    //                     if (nextNode != null) {
    //                         nextState = adapter.updateOne(nextState, {
    //                             id: nextNodeId,
    //                             changes: {
    //                                 offset:
    //                                     (nextNode.offset || 0) +
    //                                     (node.offset || 0),
    //                             },
    //                         });
    //                     }
    //                 }
    //             }
    //         }
    //         nextState = adapter.removeOne(nextState, nodeId);
    //         nextState = adapter.updateOne(nextState, {
    //             id: node.parentId,
    //             changes: {
    //                 children: parent.children.filter(
    //                     (childId) => childId !== nodeId
    //                 ),
    //             },
    //         });
    //     }
    // }
    // return nextState;
};

export default removeNode;
