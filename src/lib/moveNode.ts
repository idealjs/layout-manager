import { EntityState } from "@reduxjs/toolkit";

import { MASK_PART } from "../component/Widget";
import { adapter, INode, IPanelNode, selectById } from "../reducer/nodes";
import addNode, { ADD_RULE } from "./addNode";
import removeNode from "./removeNode";

const moveNode = (
    state: EntityState<INode>,
    searchNodeId: string,
    moveNodeId: string,
    part: MASK_PART | null
): EntityState<INode> => {
    let nextState = state;
    const moveNode = selectById(nextState, moveNodeId) as IPanelNode;

    switch (part) {
        case MASK_PART.CENTER: {
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
            nextState = removeNode(nextState, moveNodeId);
            nextState = addNode(
                nextState,
                searchNodeId,
                moveNode,
                ADD_RULE.TOP
            );
            break;
        }
        case MASK_PART.BOTTOM: {
            nextState = removeNode(nextState, moveNodeId);
            nextState = addNode(
                nextState,
                searchNodeId,
                moveNode,
                ADD_RULE.BOTTOM
            );

            break;
        }
        case MASK_PART.LEFT: {
            nextState = removeNode(nextState, moveNodeId);
            nextState = addNode(
                nextState,
                searchNodeId,
                moveNode,
                ADD_RULE.LEFT
            );
            break;
        }
        case MASK_PART.RIGHT: {
            nextState = removeNode(nextState, moveNodeId);
            nextState = addNode(
                nextState,
                searchNodeId,
                moveNode,
                ADD_RULE.RIGHT
            );
            break;
        }
        default: {
            break;
        }
    }
    return nextState;
};

export default moveNode;
