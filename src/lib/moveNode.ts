import { EntityState } from "@reduxjs/toolkit";

import { MASK_PART } from "../component/Widget";
import { ADD_RULE } from "../enum";
import { ILayoutNode, IPanelNode } from "../reducer/type";
import addNode from "./addNode";
import removeNode from "./removeNode";

const moveNode = (
    layoutNodes: EntityState<ILayoutNode>,
    panelNodes: EntityState<IPanelNode>,
    searchNodeId: string,
    moveNodeId: string,
    moveNodePage: string,
    part: MASK_PART | null
): [EntityState<ILayoutNode>, EntityState<IPanelNode>] => {
    let nextLayoutNodes = layoutNodes;
    let nextPanelNodes = panelNodes;

    return [nextLayoutNodes, nextPanelNodes];
    // let nextState = state;
    // let moveNode = selectById(nextState, moveNodeId) as IPanelNode;
    // if (moveNode == null) {
    //     moveNode = {
    //         id: moveNodeId,
    //         type: NODE_TYPE.PANEL,
    //         page: moveNodePage,
    //         parentId: "",
    //         selected: false,
    //     };
    // } else {
    //     nextState = removeNode(nextState, moveNodeId);
    // }
    // switch (part) {
    //     case MASK_PART.CENTER: {
    //         nextState = addNode(
    //             nextState,
    //             searchNodeId,
    //             moveNode,
    //             ADD_RULE.TAB
    //         );
    //         break;
    //     }
    //     case MASK_PART.TOP: {
    //         nextState = addNode(
    //             nextState,
    //             searchNodeId,
    //             moveNode,
    //             ADD_RULE.TOP
    //         );
    //         break;
    //     }
    //     case MASK_PART.BOTTOM: {
    //         nextState = addNode(
    //             nextState,
    //             searchNodeId,
    //             moveNode,
    //             ADD_RULE.BOTTOM
    //         );

    //         break;
    //     }
    //     case MASK_PART.LEFT: {
    //         nextState = addNode(
    //             nextState,
    //             searchNodeId,
    //             moveNode,
    //             ADD_RULE.LEFT
    //         );
    //         break;
    //     }
    //     case MASK_PART.RIGHT: {
    //         nextState = addNode(
    //             nextState,
    //             searchNodeId,
    //             moveNode,
    //             ADD_RULE.RIGHT
    //         );
    //         break;
    //     }
    //     default: {
    //         break;
    //     }
    // }
    // return nextState;
};

export default moveNode;
