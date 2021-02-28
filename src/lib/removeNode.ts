import { EntityState } from "@reduxjs/toolkit";

import { ROOTID } from "../constant";
import shakeTree from "../lib/shakeTree";
import { removeChild } from "../reducer/layouts";
import {
    removeNode as removePanelNodes,
    selectById as selectPanelsById,
} from "../reducer/panels";
import { ILayoutNode, IPanelNode } from "../reducer/type";

const removeNode = (
    layoutNodes: EntityState<ILayoutNode>,
    panelNodes: EntityState<IPanelNode>,
    panelNodeId: string //panelNodeId
): [EntityState<ILayoutNode>, EntityState<IPanelNode>] => {
    let nextLayoutNodes = layoutNodes;
    let nextPanelNodes = panelNodes;

    const panelNode = selectPanelsById(nextPanelNodes, panelNodeId);
    if (panelNode == null) {
        throw new Error("node not found");
    }
    nextPanelNodes = removePanelNodes(nextPanelNodes, panelNodeId);
    nextLayoutNodes = removeChild(
        nextLayoutNodes,
        panelNode.parentId,
        panelNodeId
    );
    nextLayoutNodes = shakeTree(nextLayoutNodes, ROOTID);
    return [nextLayoutNodes, nextPanelNodes];
};

export default removeNode;
