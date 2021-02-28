import { EntityState } from "@reduxjs/toolkit";
import uniqueId from "lodash.uniqueid";

import { ROOTID } from "../constant";
import { ADD_RULE } from "../enum";
import {
    adapter as layoutAdapter,
    addChild,
    selectAll as selectAllLayouts,
    selectById as selectLayoutsById,
    setAll as setAllLayouts,
} from "../reducer/layouts";
import {
    adapter as panelAdapter,
    selectAll as selectAllPanels,
    setAll as setAllPanels,
} from "../reducer/panels";
import {
    addNode as addPanelNode,
    removeNode as removePanelNodes,
    selectById as selectPanelsById,
} from "../reducer/panels";
import { ILayoutNode, IPanelNode, LAYOUT_DIRECTION } from "../reducer/type";
import immutableSplice from "./immutableSplice";
import shakeTree from "./shakeTree";

const directionFromRule = (addRule: ADD_RULE): LAYOUT_DIRECTION => {
    switch (addRule) {
        case ADD_RULE.TAB:
            return LAYOUT_DIRECTION.TAB;
        case ADD_RULE.BOTTOM:
            return LAYOUT_DIRECTION.COL;
        case ADD_RULE.TOP:
            return LAYOUT_DIRECTION.COL;
        case ADD_RULE.LEFT:
            return LAYOUT_DIRECTION.ROW;
        case ADD_RULE.RIGHT:
            return LAYOUT_DIRECTION.ROW;
        default:
            throw new Error("");
    }
};

const addNode = (
    layoutNodes: EntityState<ILayoutNode>,
    panelNodes: EntityState<IPanelNode>,
    targetPanelNodeId: string,
    panelNode: IPanelNode,
    addRule: ADD_RULE
): [EntityState<ILayoutNode>, EntityState<IPanelNode>] => {
    let nextLayoutNodes = layoutNodes;
    let nextPanelNodes = panelNodes;

    const targetPanelNode = selectPanelsById(nextPanelNodes, targetPanelNodeId);

    if (targetPanelNode == null) {
        throw new Error("");
    }
    const layoutNode = selectLayoutsById(
        nextLayoutNodes,
        targetPanelNode.parentId
    );
    if (layoutNode == null) {
        throw new Error("");
    }
    if (addRule === ADD_RULE.TAB) {
        nextPanelNodes = panelAdapter.addOne(nextPanelNodes, {
            ...panelNode,
            parentId: layoutNode.id,
        });
        nextLayoutNodes = layoutAdapter.updateOne(nextLayoutNodes, {
            id: layoutNode.id,
            changes: {
                children: layoutNode.children.concat(panelNode.id),
            },
        });

        return [nextLayoutNodes, nextPanelNodes];
    }

    const layoutParentNode = selectLayoutsById(
        nextLayoutNodes,
        layoutNode.parentId
    );
    if (layoutParentNode == null) {
        throw new Error("");
    }

    const tabLayoutNode: ILayoutNode = {
        id: uniqueId(),
        height: 0,
        width: 0,
        left: 0,
        top: 0,
        primaryOffset: 0,
        secondaryOffset: 0,
        parentId: "",
        children: [panelNode.id],
        direction: LAYOUT_DIRECTION.TAB,
    };

    if (directionFromRule(addRule) === layoutNode.direction) {
        const index = layoutParentNode.children.findIndex(
            (childId) => childId === layoutNode.id
        );
        if (
            (index === 0 &&
                (addRule === ADD_RULE.TOP || addRule === ADD_RULE.LEFT)) ||
            (index === layoutParentNode.children.length - 1 &&
                (addRule === ADD_RULE.RIGHT || addRule === ADD_RULE.BOTTOM))
        ) {
            nextPanelNodes = panelAdapter.addOne(nextPanelNodes, {
                ...panelNode,
                parentId: tabLayoutNode.id,
            });
            nextLayoutNodes = layoutAdapter.addOne(nextLayoutNodes, {
                ...tabLayoutNode,
                parentId: layoutParentNode.id,
            });
            if (addRule === ADD_RULE.TOP || addRule === ADD_RULE.LEFT) {
                nextLayoutNodes = layoutAdapter.updateOne(nextLayoutNodes, {
                    id: layoutParentNode.id,
                    changes: {
                        children: [tabLayoutNode.id].concat(
                            layoutParentNode.children
                        ),
                    },
                });
            }
            if (addRule === ADD_RULE.TOP || addRule === ADD_RULE.LEFT) {
                nextLayoutNodes = layoutAdapter.updateOne(nextLayoutNodes, {
                    id: layoutParentNode.id,
                    changes: {
                        children: layoutParentNode.children.concat(
                            tabLayoutNode.id
                        ),
                    },
                });
            }
            return [nextLayoutNodes, nextPanelNodes];
        }
        if (addRule === ADD_RULE.TOP || addRule === ADD_RULE.LEFT) {
        }
        if (addRule === ADD_RULE.RIGHT || addRule === ADD_RULE.BOTTOM) {
        }
    } else {
    }

    // if (
    //     targetNode.direction === LAYOUT_DIRECTION.TAB &&
    //     addRule === ADD_RULE.TAB
    // ) {
    //     addChild(
    //         nextLayoutNodes,
    //         targetNodeId,
    //         panelNode.id,
    //         targetNode.children.length
    //     );
    //     nextPanelNodes = addPanelNode(nextPanelNodes, {
    //         ...panelNode,
    //         parentId: targetNodeId,
    //     });
    // } else {
    //     const layoutNode: ILayoutNode = {
    //         id: uniqueId(),
    //         parentId: "",
    //         direction: LAYOUT_DIRECTION.COL,
    //         children: [],
    //         height: 0,
    //         width: 0,
    //         left: 0,
    //         top: 0,
    //         primaryOffset: 0,
    //         secondaryOffset: 0,
    //     };

    //     const widgetNode: ILayoutNode = {
    //         id: uniqueId(),
    //         parentId: "",
    //         direction: LAYOUT_DIRECTION.TAB,
    //         children: [],
    //         height: 0,
    //         width: 0,
    //         left: 0,
    //         top: 0,
    //         primaryOffset: 0,
    //         secondaryOffset: 0,
    //     };

    //     let layoutChildren: string[] = [];
    //     let layoutDirection: LAYOUT_DIRECTION = LAYOUT_DIRECTION.COL;
    //     if (addRule === ADD_RULE.TOP) {
    //         layoutChildren = [widgetNode.id, targetNodeId];
    //         layoutDirection = LAYOUT_DIRECTION.COL;
    //     }
    //     if (addRule === ADD_RULE.BOTTOM) {
    //         layoutChildren = [targetNodeId, widgetNode.id];
    //         layoutDirection = LAYOUT_DIRECTION.COL;
    //     }
    //     if (addRule === ADD_RULE.LEFT) {
    //         layoutChildren = [widgetNode.id, targetNodeId];
    //         layoutDirection = LAYOUT_DIRECTION.ROW;
    //     }
    //     if (addRule === ADD_RULE.RIGHT) {
    //         layoutChildren = [targetNodeId, widgetNode.id];
    //         layoutDirection = LAYOUT_DIRECTION.ROW;
    //     }
    //     // nextLayoutNodes = adapter.upsertMany(nextLayoutNodes, [
    //     //     {
    //     //         ...targetNode,
    //     //         parentId: layoutNode.id,
    //     //         primaryOffset: 0,
    //     //         secondaryOffset: 0,
    //     //         height: 0,
    //     //         width: 0,
    //     //     },
    //     //     {
    //     //         ...layoutNode,
    //     //         direction: layoutDirection,
    //     //         parentId: targetNode.parentId,
    //     //         primaryOffset: targetNode.primaryOffset,
    //     //         secondaryOffset: targetNode.secondaryOffset,
    //     //         height: targetNode.height,
    //     //         width: targetNode.width,
    //     //         children: layoutChildren,
    //     //     },
    //     //     {
    //     //         ...widgetNode,
    //     //         parentId: layoutNode.id,
    //     //         children: [panelNode.id],
    //     //     },
    //     // ]);
    //     //         const searchParent = selectById(nextState, searchNode?.parentId);

    //     //          const index = searchParent.children.findIndex(
    //     //         (childId) => childId === searchNodeId
    //     //     );
    //     //         if (index !== -1) {
    //     //             nextState = adapter.updateMany(nextState, [
    //     //                 {
    //     //                     id: searchNode.parentId,
    //     //                     changes: {
    //     //                         children: immutableSplice(
    //     //                             searchParent.children,
    //     //                             index,
    //     //                             1,
    //     //                             layoutNode.id
    //     //                         ),
    //     //                     },
    //     //                 },
    //     //             ]);
    //     //         }
    // }

    // nextLayoutNodes = shakeTree(nextLayoutNodes, ROOTID);

    return [nextLayoutNodes, nextPanelNodes];

    //     if (isLayoutNode(searchParent)) {

    //     }
    // }

    // if (searchNode?.type === NODE_TYPE.PANEL) {
    //     // panel's parent must be a node which direction is tab
    //     nextState = addNode(nextState, searchNode.parentId, panelNode, addRule);
    // }
};

export default addNode;
