import { EntityState } from "@reduxjs/toolkit";
import uniqueId from "lodash.uniqueid";

import { ROOTID } from "../constant";
import { ADD_RULE } from "../enum";
import { ILayoutNode, IPanelNode } from "../reducer/type";
import addNode from "./addNode";

export interface IRule {
    addRule: ADD_RULE;
    limit: number;
}

// const getDirection = (addRule: ADD_RULE) => {
//     switch (addRule) {
//         case ADD_RULE.LEFT:
//             return DIRECTION.ROW;
//         case ADD_RULE.RIGHT:
//             return DIRECTION.ROW;
//         case ADD_RULE.BOTTOM:
//             return DIRECTION.COLUMN;
//         case ADD_RULE.TOP:
//             return DIRECTION.COLUMN;
//         case ADD_RULE.TAB:
//             return DIRECTION.TAB;

//         default:
//             throw new Error(`Can't handle addRule ${addRule}`);
//     }
// };

const findNode = async (
    state: EntityState<ILayoutNode>,
    nodeId: string,
    predict: (node: Readonly<ILayoutNode>, level: number) => boolean
): Promise<ILayoutNode | null> => {
    return new Promise((resolve, reject) => {
        // traverse(state, nodeId, (node, level) => {
        //     if (predict(node, level)) {
        //         resolve(node);
        //     }
        // });
        resolve(null);
    });
};

const addNodeByRule = async (
    layoutNodes: EntityState<ILayoutNode>,
    panelNodes: EntityState<IPanelNode>,
    panelNode: IPanelNode,
    rule: {
        addRule: ADD_RULE;
        limit: number;
    },
    ruleIndex: number
): Promise<[EntityState<ILayoutNode>, EntityState<IPanelNode>, boolean]> => {
    let nextLayoutNodes = layoutNodes;
    let nextPanelNodes = panelNodes;

    return [nextLayoutNodes, nextPanelNodes, false];
    // let nextState = state;
    // if (rule.addRule === ADD_RULE.TAB) {
    //     const targetNode = await findNode(
    //         nextState,
    //         ROOTID,
    //         (node) =>
    //             isLayoutNode(node) &&
    //             node.id !== ROOTID &&
    //             node.direction === DIRECTION.TAB &&
    //             node.children?.length < rule.limit
    //     );
    //     if (targetNode != null) {
    //         nextState = addNode(state, targetNode.id, panelNode, rule.addRule);
    //         return {
    //             state: nextState,
    //             success: true,
    //         };
    //     }
    // }

    // if (rule.addRule !== ADD_RULE.TAB && ruleIndex === 0) {
    //     const targetNode = await findNode(
    //         nextState,
    //         ROOTID,
    //         (node, level) =>
    //             node.id !== ROOTID &&
    //             (node.direction === getDirection(rule.addRule) ||
    //                 node.direction === DIRECTION.TAB) &&
    //             node.children?.length < rule.limit &&
    //             level <= 1
    //     );
    //     if (targetNode != null) {
    //         nextState = addNode(state, targetNode.id, panelNode, rule.addRule);
    //         return {
    //             state: nextState,
    //             success: true,
    //         };
    //     }
    // } else {
    //     const targetNode = await findNode(
    //         nextState,
    //         ROOTID,
    //         (node, level) =>
    //             node.id !== ROOTID &&
    //             (node.direction === getDirection(rule.addRule) ||
    //                 node.direction === DIRECTION.TAB) &&
    //             node.children?.length < rule.limit &&
    //             level <= 2
    //     );
    //     if (targetNode != null) {
    //         nextState = addNode(state, targetNode.id, panelNode, rule.addRule);
    //         return {
    //             state: nextState,
    //             success: true,
    //         };
    //     }
    // }
};

const addNodeByRules = async (
    layoutNodes: EntityState<ILayoutNode>,
    panelNodes: EntityState<IPanelNode>,
    page: string,
    rules: IRule[],
    max: number,
    nodeData?: any
): Promise<[EntityState<ILayoutNode>, EntityState<IPanelNode>]> => {
    let nextLayoutNodes = layoutNodes;
    let nextPanelNodes = panelNodes;

    return [nextLayoutNodes, nextPanelNodes];
    // let nextState = state;
    // if (
    //     selectAll(nextState).filter((n) => n.type === NODE_TYPE.PANEL).length >
    //     max
    // ) {
    //     throw new Error(`Panel node up to limit ${max}`);
    // }

    // const panelNode: IPanelNode = {
    //     id: uniqueId(),
    //     type: NODE_TYPE.PANEL,
    //     parentId: "",
    //     page,
    //     selected: false,
    //     data: nodeData,
    // };

    // for (const [i, rule] of rules.entries()) {
    //     const { state, success } = await addNodeByRule(
    //         nextState,
    //         panelNode,
    //         rule,
    //         i
    //     );
    //     if (success) {
    //         return state;
    //     }
    // }
    // return nextState;
};

export default addNodeByRules;
