import { EntityState } from "@reduxjs/toolkit";
import uniqueId from "lodash.uniqueid";

import {
    adapter,
    DIRECTION,
    ILayoutNode,
    INode,
    IPanelNode,
    NODE_TYPE,
    selectById,
} from "../reducer/nodes";
import immutableSplice from "./immutableSplice";

export enum ADD_RULE {
    TOP = "TOP",
    LEFT = "LEFT",
    BOTTOM = "BOTTOM",
    RIGHT = "RIGHT",
    TAB = "TAB",
}

const isLayoutNode = (node: INode | undefined): node is ILayoutNode => {
    return node?.type === NODE_TYPE.LAYOUT_NODE;
};

const addNode = (
    state: EntityState<INode>,
    searchNodeId: string,
    page: string,
    addRule: ADD_RULE
) => {
    let nextState = state;
    const searchNode = selectById(nextState, searchNodeId);
    if (searchNode == null) {
        return nextState;
    }

    const layoutNode: ILayoutNode = {
        id: uniqueId(),
        parentId: "",
        type: NODE_TYPE.LAYOUT_NODE,
        direction: DIRECTION.COLUMN,
        children: [],
        offset: 0,
        height: 0,
        width: 0,
    };

    const widgetNode: ILayoutNode = {
        id: uniqueId(),
        parentId: "",
        type: NODE_TYPE.LAYOUT_NODE,
        direction: DIRECTION.TAB,
        children: [],
        offset: 0,
        height: 0,
        width: 0,
    };

    const panelNode: IPanelNode = {
        id: uniqueId(),
        parentId: "",
        type: NODE_TYPE.PANEL,
        page: page,
        selected: false,
    };

    if (isLayoutNode(searchNode)) {
        if (searchNode.direction === DIRECTION.TAB) {
            if (addRule === ADD_RULE.TAB) {
                nextState = adapter.upsertMany(nextState, [
                    {
                        ...searchNode,
                        children: searchNode.children.concat(panelNode.id),
                    },
                    {
                        ...panelNode,
                        parentId: searchNode.id,
                    },
                ]);
            }
        } else {
            if (addRule === ADD_RULE.TAB) {
                throw new Error(
                    "Please select a node direction is tab to add under tab rule"
                );
            }
        }

        let layoutChildren: string[] = [];
        let layoutDirection: DIRECTION = DIRECTION.COLUMN;
        if (addRule === ADD_RULE.TOP) {
            layoutChildren = [widgetNode.id, searchNode.id];
            layoutDirection = DIRECTION.COLUMN;
        }
        if (addRule === ADD_RULE.BOTTOM) {
            layoutChildren = [searchNode.id, widgetNode.id];
            layoutDirection = DIRECTION.COLUMN;
        }
        if (addRule === ADD_RULE.LEFT) {
            layoutChildren = [widgetNode.id, searchNode.id];
            layoutDirection = DIRECTION.ROW;
        }
        if (addRule === ADD_RULE.RIGHT) {
            layoutChildren = [searchNode.id, widgetNode.id];
            layoutDirection = DIRECTION.ROW;
        }
        nextState = adapter.upsertMany(nextState, [
            {
                ...searchNode,
                parentId: layoutNode.id,
                offset: 0,
                height: 0,
                width: 0,
            },
            {
                ...layoutNode,
                direction: layoutDirection,
                parentId: searchNode.parentId,
                offset: searchNode.offset,
                height: searchNode.height,
                width: searchNode.width,
                children: layoutChildren,
            },
            {
                ...widgetNode,
                parentId: layoutNode.id,
                children: [panelNode.id],
            },
            {
                ...panelNode,
                parentId: widgetNode.id,
            },
        ]);

        const searchParent = selectById(nextState, searchNode?.parentId);
        if (isLayoutNode(searchParent)) {
            const index = searchParent.children.findIndex(
                (childId) => childId === searchNodeId
            );
            if (index !== -1) {
                nextState = adapter.updateMany(nextState, [
                    {
                        id: searchNode.parentId,
                        changes: {
                            children: immutableSplice(
                                searchParent.children,
                                index,
                                1,
                                layoutNode.id
                            ),
                        },
                    },
                ]);
            }
        }
    }

    if (searchNode?.type === NODE_TYPE.PANEL) {
        // panel's parent must be a node which direction is tab
        nextState = addNode(nextState, searchNode.parentId, page, addRule);
    }

    return nextState;
};

export default addNode;
