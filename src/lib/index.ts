import { EntityState } from "@reduxjs/toolkit";
import { uniqueId } from "lodash";

import { MASK_PART } from "../component/Widget";
import {
    adapter,
    DIRECTION,
    INode,
    NODE_TYPE,
    selectById,
} from "../reducer/nodes";
import immutableSplice from "./immutableSplice";

export const moveNode = (
    state: EntityState<INode>,
    searchNodeId: string,
    moveNodeId: string,
    part: MASK_PART | null
): EntityState<INode> => {
    let nextState = state;

    switch (part) {
        case MASK_PART.CENTER: {
            const moveNode = selectById(nextState, moveNodeId);
            nextState = removeNode(nextState, moveNodeId);

            if (moveNode != null) {
                nextState = adapter.addOne(nextState, moveNode);
            }

            const searchNode = selectById(nextState, searchNodeId);

            nextState = adapter.updateMany(nextState, [
                {
                    id: searchNodeId,
                    changes: {
                        children:
                            searchNode?.children != null
                                ? searchNode.children.concat(moveNodeId)
                                : [moveNodeId],
                    },
                },
                {
                    id: moveNodeId,
                    changes: {
                        parentId: searchNodeId,
                    },
                },
            ]);
            break;
        }
        case MASK_PART.TOP: {
            const moveNode = selectById(nextState, moveNodeId);
            nextState = removeNode(nextState, moveNodeId);

            const searchNode = selectById(nextState, searchNodeId);

            const layoutId = uniqueId();
            const layout: INode = {
                id: layoutId,
                parentId: "",
                type: NODE_TYPE.LAYOUT_NODE,
                direction: DIRECTION.COLUMN,
                children: [],
            };
            nextState = adapter.addOne(nextState, layout);

            nextState = replaceNode(nextState, searchNodeId, layoutId);
            // nextState = removeNode(nextState, searchNodeId, false);
            const widgetId = uniqueId();
            const widget: INode = {
                id: widgetId,
                parentId: "",
                type: NODE_TYPE.WIDGET_NODE,
                children: [],
            };

            if (searchNode != null && moveNode != null) {
                nextState = adapter.addMany(nextState, [
                    widget,
                    searchNode,
                    moveNode,
                ]);
            }

            nextState = adapter.updateMany(nextState, [
                {
                    id: searchNodeId,
                    changes: {
                        parentId: layoutId,
                    },
                },
                {
                    id: widgetId,
                    changes: {
                        parentId: layoutId,
                        children: [moveNodeId],
                    },
                },
                {
                    id: layoutId,
                    changes: {
                        children: [widgetId, searchNodeId],
                    },
                },
                {
                    id: moveNodeId,
                    changes: {
                        parentId: widgetId,
                    },
                },
            ]);

            break;
        }
        case MASK_PART.BOTTOM: {
            break;
        }
        case MASK_PART.LEFT: {
            break;
        }
        case MASK_PART.RIGHT: {
            break;
        }
        default: {
            break;
        }
    }
    return nextState;
};

export const removeNode = (
    state: EntityState<INode>,
    nodeId: string,
    keepOffset: boolean = true
): EntityState<INode> => {
    let nextState = state;
    console.debug("[Info] removeNode", nodeId);
    const node = selectById(state, nodeId);
    if (node?.parentId != null) {
        const parent = selectById(nextState, node?.parentId);
        if (parent?.children != null) {
            //update borther's offset before node removed.
            if (keepOffset) {
                const index = parent.children.findIndex(
                    (childId) => childId === nodeId
                );
                if (index !== -1) {
                    const prevNodeId = parent.children[index - 1];
                    const nextNodeId = parent.children[index + 1];
                    if (prevNodeId != null) {
                        const prevNode = selectById(nextState, prevNodeId);
                        if (prevNode != null) {
                            nextState = adapter.updateOne(nextState, {
                                id: prevNodeId,
                                changes: {
                                    offset:
                                        (prevNode.offset || 0) +
                                        (node.offset || 0),
                                },
                            });
                        }
                    }
                    if (nextNodeId != null) {
                        const nextNode = selectById(nextState, nextNodeId);
                        if (nextNode != null) {
                            nextState = adapter.updateOne(nextState, {
                                id: nextNodeId,
                                changes: {
                                    offset:
                                        (nextNode.offset || 0) -
                                        (node.offset || 0),
                                },
                            });
                        }
                    }
                }
            }
            nextState = adapter.removeOne(nextState, nodeId);
            nextState = adapter.updateOne(nextState, {
                id: node.parentId,
                changes: {
                    children: parent.children.filter(
                        (childId) => childId !== nodeId
                    ),
                },
            });
            selectById(nextState, nodeId);
        }
    }
    return nextState;
};

export const replaceNode = (
    state: EntityState<INode>,
    searchNodeId: string,
    replaceNodeId: string,
    keepOffset: boolean = true
): EntityState<INode> => {
    console.debug("[Info] replaceNode", searchNodeId, replaceNodeId);
    let nextState = state;
    const searchNode = selectById(nextState, searchNodeId);
    if (searchNode?.parentId != null) {
        const replaceParent = selectById(nextState, searchNode.parentId);
        if (replaceParent?.children != null) {
            const index = replaceParent.children.findIndex(
                (childId) => childId === searchNodeId
            );
            if (index !== -1) {
                nextState = adapter.updateMany(nextState, [
                    {
                        id: replaceNodeId,
                        changes: {
                            parentId: searchNode.parentId,
                            offset: keepOffset ? searchNode.offset : 0,
                        },
                    },
                    {
                        id: searchNode.parentId,
                        changes: {
                            children: immutableSplice(
                                replaceParent.children,
                                index,
                                1,
                                replaceNodeId
                            ),
                        },
                    },
                ]);
            }
        }
    }
    return nextState;
};

export const shakeTree = (
    state: EntityState<INode>,
    nodeId: string
): EntityState<INode> => {
    let nextState = state;
    let node = selectById(nextState, nodeId);

    if (node?.children != null) {
        nextState = node.children.reduce((previousValue, currentValue) => {
            const s = shakeTree(previousValue, currentValue);
            return s;
        }, nextState);

        node = selectById(nextState, nodeId);
        console.debug("[Info] shakeTree", nodeId);
        if (node?.children != null && nodeId !== "root") {
            let parent = selectById(nextState, node.parentId);

            if (node.children.length === 0 && node.type !== NODE_TYPE.PANEL) {
                nextState = removeNode(nextState, nodeId);
            }

            if (
                node.type === NODE_TYPE.LAYOUT_NODE &&
                parent?.type === NODE_TYPE.LAYOUT_NODE &&
                node.children.length === 1
            ) {
                nextState = replaceNode(nextState, nodeId, node.children[0]);
                nextState = removeNode(nextState, nodeId);
            }
        }
    }
    return nextState;
};
