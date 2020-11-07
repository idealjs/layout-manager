import {
    createEntityAdapter,
    createSlice,
    EntityState,
} from "@reduxjs/toolkit";
import {
    ForwardRefExoticComponent,
    FunctionComponent,
    RefAttributes,
} from "react";

export enum NODE_TYPE {
    LAYOUT_NODE = "LAYOUT_NODE",
    WIDGET_NODE = "WIDGET_NODE",
    PANEL = "PANEL",
}

export enum DIRECTION {
    COLUMN = "column",
    COLUMNREV = "column-reverse",
    ROW = "row",
    ROWREV = "row-reverse",
}

export interface INode {
    id: string;
    type: NODE_TYPE;
    parentId: string;

    direction?: DIRECTION;
    offset?: number;
    height?: number;
    width?: number;
    selected?: boolean;
    children?: string[];
    Page?: FunctionComponent;
    Tab?: ForwardRefExoticComponent<
        {
            nodeId: string;
            nodeTitle: string;
            onClose: () => void;
            onSelect: () => void;
        } & RefAttributes<HTMLDivElement>
    >;
}

export const adapter = createEntityAdapter<INode>({
    selectId: (n) => n.id,
});

const slice = createSlice({
    name: "nodes",
    initialState: adapter.getInitialState(),
    reducers: {
        addMany: adapter.addMany,
        updateOne: adapter.updateOne,
        updateMany: adapter.updateMany,
        // move: (
        //     state,
        //     action: PayloadAction<{ nodeId: string; toNodeId: string }>
        // ) => {
        //     return state;
        // },
        removeOne: adapter.removeOne,
        remove: (
            state,
            action: { type: string; payload: { nodeId: string } }
        ) => {
            const nextState = removeNode(state, action.payload.nodeId);
            return shakeTree(nextState, "root");
        },
    },
});

const removeNode = (
    state: EntityState<INode>,
    nodeId: string
): EntityState<INode> => {
    const node = adapter.getSelectors().selectById(state, nodeId);
    if (node?.parentId != null) {
        let nextState = adapter.removeOne(state, nodeId);
        const parent = adapter
            .getSelectors()
            .selectById(nextState, node?.parentId);
        if (parent?.children != null) {
            nextState = adapter.updateOne(nextState, {
                id: parent.id,
                changes: {
                    children: parent.children.filter(
                        (childId) => childId !== nodeId
                    ),
                },
            });
        }
        return nextState;
    } else {
        return state;
    }
};

const shakeTree = (
    state: EntityState<INode>,
    nodeId: string
): EntityState<INode> => {
    console.debug("[Info] shakeTree", nodeId);

    const node = selectById(state, nodeId);
    if (node?.children != null) {
        let nextState = node.children.reduce((previousValue, currentValue) => {
            const state = shakeTree(previousValue, currentValue);
            return state;
        }, state);

        if (
            node?.children?.length === 0 &&
            nodeId !== "root" &&
            node.type !== NODE_TYPE.PANEL
        ) {
            removeNode(nextState, nodeId);
        }

        return nextState;
    } else {
        return state;
    }
};

export default slice.reducer;

export const {
    addMany,
    updateOne,
    updateMany,
    removeOne,
    remove,
} = slice.actions;

export type NodeState = ReturnType<typeof slice.reducer>;

export const { selectById, selectAll } = adapter.getSelectors();
