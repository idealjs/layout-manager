import { EntityState } from "@reduxjs/toolkit";
import uniqueId from "lodash.uniqueid";

import { ADD_RULE } from "../enum";
import {
    adapter as layoutAdapter,
    selectById as selectLayoutsById,
} from "../reducer/layouts";
import { adapter as panelAdapter } from "../reducer/panels";
import { ILayoutNode, IPanelNode, LAYOUT_DIRECTION } from "../reducer/type";
import immutableSplice from "./immutableSplice";

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
    targetTabLayoutNodeId: string,
    panelNode: IPanelNode,
    addRule: ADD_RULE
): [EntityState<ILayoutNode>, EntityState<IPanelNode>] => {
    let nextLayoutNodes = layoutNodes;
    let nextPanelNodes = panelNodes;

    const layoutNode = selectLayoutsById(
        nextLayoutNodes,
        targetTabLayoutNodeId
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
    const ruleDirection = directionFromRule(addRule);
    const index = layoutParentNode.children.findIndex(
        (childId) => childId === layoutNode.id
    );
    if (ruleDirection === layoutNode.direction) {
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
            nextPanelNodes = panelAdapter.addOne(nextPanelNodes, {
                ...panelNode,
                parentId: tabLayoutNode.id,
            });

            const primaryNode = selectLayoutsById(
                nextLayoutNodes,
                layoutParentNode.children[index - 1]
            );
            if (primaryNode == null) {
                throw new Error("");
            }
            nextLayoutNodes = layoutAdapter.addOne(nextLayoutNodes, {
                ...tabLayoutNode,
                parentId: layoutParentNode.id,
                primaryOffset: primaryNode.secondaryOffset,
                secondaryOffset: layoutNode.primaryOffset,
            });

            nextLayoutNodes = layoutAdapter.updateOne(nextLayoutNodes, {
                id: layoutParentNode.id,
                changes: {
                    children: immutableSplice(
                        layoutParentNode.children,
                        index,
                        0,
                        tabLayoutNode.id
                    ),
                },
            });
        }
        if (addRule === ADD_RULE.RIGHT || addRule === ADD_RULE.BOTTOM) {
            nextPanelNodes = panelAdapter.addOne(nextPanelNodes, {
                ...panelNode,
                parentId: tabLayoutNode.id,
            });

            const secondaryNode = selectLayoutsById(
                nextLayoutNodes,
                layoutParentNode.children[index + 1]
            );
            if (secondaryNode == null) {
                throw new Error("");
            }
            nextLayoutNodes = layoutAdapter.addOne(nextLayoutNodes, {
                ...tabLayoutNode,
                parentId: layoutParentNode.id,
                primaryOffset: layoutNode.secondaryOffset,
                secondaryOffset: secondaryNode.primaryOffset,
            });
            nextLayoutNodes = layoutAdapter.updateOne(nextLayoutNodes, {
                id: layoutParentNode.id,
                changes: {
                    children: immutableSplice(
                        layoutParentNode.children,
                        index + 1,
                        0,
                        tabLayoutNode.id
                    ),
                },
            });
        }
    } else {
        const newLayoutNode: ILayoutNode = {
            id: uniqueId(),
            height: 0,
            width: 0,
            left: 0,
            top: 0,
            primaryOffset: 0,
            secondaryOffset: 0,
            parentId: "",
            children: [tabLayoutNode.id],
            direction: ruleDirection,
        };
        if (addRule === ADD_RULE.TOP || addRule === ADD_RULE.LEFT) {
            nextLayoutNodes = layoutAdapter.addMany(nextLayoutNodes, [
                {
                    ...newLayoutNode,
                    parentId: layoutParentNode.id,
                    primaryOffset: layoutNode.primaryOffset,
                    secondaryOffset: layoutNode.secondaryOffset,
                    children: [tabLayoutNode.id, layoutNode.id],
                },
                { ...tabLayoutNode, parentId: newLayoutNode.id },
            ]);
            nextLayoutNodes = layoutAdapter.updateMany(nextLayoutNodes, [
                {
                    id: layoutParentNode.id,
                    changes: {
                        children: immutableSplice(
                            layoutParentNode.children,
                            index,
                            1,
                            newLayoutNode.id
                        ),
                    },
                },
                {
                    id: layoutNode.id,
                    changes: {
                        parentId: newLayoutNode.id,
                        primaryOffset: 0,
                        secondaryOffset: 0,
                    },
                },
            ]);
            nextPanelNodes = panelAdapter.addOne(nextPanelNodes, {
                ...panelNode,
                parentId: tabLayoutNode.id,
            });
            return [nextLayoutNodes, nextPanelNodes];
        }
        if (addRule === ADD_RULE.RIGHT || addRule === ADD_RULE.BOTTOM) {
            nextLayoutNodes = layoutAdapter.addMany(nextLayoutNodes, [
                {
                    ...newLayoutNode,
                    parentId: layoutParentNode.id,
                    primaryOffset: layoutNode.primaryOffset,
                    secondaryOffset: layoutNode.secondaryOffset,
                    children: [layoutNode.id, tabLayoutNode.id],
                },
                { ...tabLayoutNode, parentId: newLayoutNode.id },
            ]);
            nextLayoutNodes = layoutAdapter.updateMany(nextLayoutNodes, [
                {
                    id: layoutParentNode.id,
                    changes: {
                        children: immutableSplice(
                            layoutParentNode.children,
                            index,
                            1,
                            newLayoutNode.id
                        ),
                    },
                },
                {
                    id: layoutNode.id,
                    changes: {
                        parentId: newLayoutNode.id,
                        primaryOffset: 0,
                        secondaryOffset: 0,
                    },
                },
            ]);
            nextPanelNodes = panelAdapter.addOne(nextPanelNodes, {
                ...panelNode,
                parentId: tabLayoutNode.id,
            });
            return [nextLayoutNodes, nextPanelNodes];
        }
    }

    return [nextLayoutNodes, nextPanelNodes];
};

export default addNode;
