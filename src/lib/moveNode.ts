import { EntityState } from "@reduxjs/toolkit";
import uniqueId from "lodash.uniqueid";

import { MASK_PART } from "../component/Widget";
import {
    adapter,
    DIRECTION,
    INode,
    NODE_TYPE,
    selectById,
} from "../reducer/nodes";
import removeNode from "./removeNode";
import replaceNode from "./replaceNode";

const moveNode = (
    state: EntityState<INode>,
    searchNodeId: string,
    moveNodeId: string,
    part: MASK_PART | null
): EntityState<INode> => {
    let nextState = state;

    switch (part) {
        case MASK_PART.CENTER: {
            const moveNode = selectById(nextState, moveNodeId);
            nextState = removeNode(nextState, moveNodeId, true);

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
                        offset: 0,
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
                        offset: 0,
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
                        children: [searchNodeId, widgetId],
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
        case MASK_PART.LEFT: {
            const moveNode = selectById(nextState, moveNodeId);
            nextState = removeNode(nextState, moveNodeId);

            const searchNode = selectById(nextState, searchNodeId);

            const layoutId = uniqueId();
            const layout: INode = {
                id: layoutId,
                parentId: "",
                type: NODE_TYPE.LAYOUT_NODE,
                direction: DIRECTION.ROW,
                children: [],
            };
            nextState = adapter.addOne(nextState, layout);

            nextState = replaceNode(nextState, searchNodeId, layoutId);
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
                        offset: 0,
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
        case MASK_PART.RIGHT: {
            const moveNode = selectById(nextState, moveNodeId);
            nextState = removeNode(nextState, moveNodeId);

            const searchNode = selectById(nextState, searchNodeId);

            const layoutId = uniqueId();
            const layout: INode = {
                id: layoutId,
                parentId: "",
                type: NODE_TYPE.LAYOUT_NODE,
                direction: DIRECTION.ROW,
                children: [],
            };
            nextState = adapter.addOne(nextState, layout);

            nextState = replaceNode(nextState, searchNodeId, layoutId);
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
                        offset: 0,
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
                        children: [searchNodeId, widgetId],
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
        default: {
            break;
        }
    }
    return nextState;
};

export default moveNode;
