import { EntityState } from "@reduxjs/toolkit";
import uniqueId from "lodash.uniqueid";

import { ADD_RULE } from "../enum";
import { ILayoutNode, IPanelNode, LAYOUT_DIRECTION } from "../reducer/type";
import immutableSplice from "./immutableSplice";

const addNode = (
    layoutNodes: EntityState<ILayoutNode>,
    panelNodes: EntityState<IPanelNode>,
    searchNodeId: string,
    panelNode: IPanelNode,
    addRule: ADD_RULE
): [EntityState<ILayoutNode>, EntityState<IPanelNode>] => {
    let nextLayoutNodes = layoutNodes;
    let nextPanelNodes = panelNodes;

    return [nextLayoutNodes, nextPanelNodes];

    // let nextState = state;
    // const layoutNode = selectById(nextState, searchNodeId);
    // if (layoutNode == null) {
    //     return nextState;
    // }

    // const layoutNode: ILayoutNode = {
    //     id: uniqueId(),
    //     parentId: "",
    //     type: NODE_TYPE.LAYOUT_NODE,
    //     direction: LAYOUT_DIRECTION.COLUMN,
    //     children: [],
    //     offset: 0,
    //     height: 0,
    //     width: 0,
    //     left: 0,
    //     top: 0,
    // };

    // const widgetNode: ILayoutNode = {
    //     id: uniqueId(),
    //     parentId: "",
    //     type: NODE_TYPE.LAYOUT_NODE,
    //     direction: LAYOUT_DIRECTION.TAB,
    //     children: [],
    //     offset: 0,
    //     height: 0,
    //     width: 0,
    //     left: 0,
    //     top: 0,
    // };

    // if (isLayoutNode(searchNode)) {
    //     if (searchNode.direction === LAYOUT_DIRECTION.TAB) {
    //         if (addRule === ADD_RULE.TAB) {
    //             nextState = adapter.upsertMany(nextState, [
    //                 {
    //                     ...searchNode,
    //                     children: searchNode.children.concat(panelNode.id),
    //                 },
    //                 {
    //                     ...panelNode,
    //                     parentId: searchNode.id,
    //                 },
    //             ]);
    //             return nextState;
    //         }
    //     } else {
    //         if (addRule === ADD_RULE.TAB) {
    //             throw new Error(
    //                 "Please select a node direction is tab to add under tab rule"
    //             );
    //         }
    //     }

    //     let layoutChildren: string[] = [];
    //     let layoutDirection: LAYOUT_DIRECTION = LAYOUT_DIRECTION.COLUMN;
    //     if (addRule === ADD_RULE.TOP) {
    //         layoutChildren = [widgetNode.id, searchNode.id];
    //         layoutDirection = LAYOUT_DIRECTION.COLUMN;
    //     }
    //     if (addRule === ADD_RULE.BOTTOM) {
    //         layoutChildren = [searchNode.id, widgetNode.id];
    //         layoutDirection = LAYOUT_DIRECTION.COLUMN;
    //     }
    //     if (addRule === ADD_RULE.LEFT) {
    //         layoutChildren = [widgetNode.id, searchNode.id];
    //         layoutDirection = LAYOUT_DIRECTION.ROW;
    //     }
    //     if (addRule === ADD_RULE.RIGHT) {
    //         layoutChildren = [searchNode.id, widgetNode.id];
    //         layoutDirection = LAYOUT_DIRECTION.ROW;
    //     }
    //     nextState = adapter.upsertMany(nextState, [
    //         {
    //             ...searchNode,
    //             parentId: layoutNode.id,
    //             offset: 0,
    //             height: 0,
    //             width: 0,
    //         },
    //         {
    //             ...layoutNode,
    //             direction: layoutDirection,
    //             parentId: searchNode.parentId,
    //             offset: searchNode.offset,
    //             height: searchNode.height,
    //             width: searchNode.width,
    //             children: layoutChildren,
    //         },
    //         {
    //             ...widgetNode,
    //             parentId: layoutNode.id,
    //             children: [panelNode.id],
    //         },
    //         {
    //             ...panelNode,
    //             parentId: widgetNode.id,
    //         },
    //     ]);

    //     const searchParent = selectById(nextState, searchNode?.parentId);
    //     if (isLayoutNode(searchParent)) {
    //         const index = searchParent.children.findIndex(
    //             (childId) => childId === searchNodeId
    //         );
    //         if (index !== -1) {
    //             nextState = adapter.updateMany(nextState, [
    //                 {
    //                     id: searchNode.parentId,
    //                     changes: {
    //                         children: immutableSplice(
    //                             searchParent.children,
    //                             index,
    //                             1,
    //                             layoutNode.id
    //                         ),
    //                     },
    //                 },
    //             ]);
    //         }
    //     }
    // }

    // if (searchNode?.type === NODE_TYPE.PANEL) {
    //     // panel's parent must be a node which direction is tab
    //     nextState = addNode(nextState, searchNode.parentId, panelNode, addRule);
    // }
};

export default addNode;
