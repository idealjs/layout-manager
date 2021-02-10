import { EntityState } from "@reduxjs/toolkit";

import { MASK_PART } from "../component/Widget";
import { ADD_RULE } from "../enum";
import { INode, IPanelNode, NODE_TYPE, selectById } from "../reducer/nodes";
import addNode from "./addNode";
import removeNode from "./removeNode";

const moveNode = (
    state: EntityState<INode>,
    searchNodeId: string,
    moveNodeId: string,
    moveNodePage: string,
    part: MASK_PART | null
): EntityState<INode> => {
    let nextState = state;
    let moveNode = selectById(nextState, moveNodeId) as IPanelNode;
    if (moveNode == null) {
        moveNode = {
            id: moveNodeId,
            type: NODE_TYPE.PANEL,
            page: moveNodePage,
            parentId: "",
            selected: false,
        };
    } else {
        nextState = removeNode(nextState, moveNodeId);
    }
    switch (part) {
        case MASK_PART.CENTER: {
            nextState = addNode(
                nextState,
                searchNodeId,
                moveNode,
                ADD_RULE.TAB
            );
            break;
        }
        case MASK_PART.TOP: {
            nextState = addNode(
                nextState,
                searchNodeId,
                moveNode,
                ADD_RULE.TOP
            );
            break;
        }
        case MASK_PART.BOTTOM: {
            nextState = addNode(
                nextState,
                searchNodeId,
                moveNode,
                ADD_RULE.BOTTOM
            );

            break;
        }
        case MASK_PART.LEFT: {
            nextState = addNode(
                nextState,
                searchNodeId,
                moveNode,
                ADD_RULE.LEFT
            );
            break;
        }
        case MASK_PART.RIGHT: {
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
