import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
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

export type TABCMPT = ForwardRefExoticComponent<
    {
        nodeId: string;
        nodeTitle: string;
        onClose: () => void;
        onSelect: () => void;
    } & RefAttributes<HTMLDivElement>
>;

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
        removeOne: adapter.removeOne,
        upsertMany: adapter.upsertMany,
        setAll: adapter.setAll,
    },
});

export default slice.reducer;

export const {
    addMany,
    updateOne,
    updateMany,
    removeOne,
    upsertMany,
    setAll,
} = slice.actions;

export type NodeState = ReturnType<typeof slice.reducer>;

export const { selectById, selectAll } = adapter.getSelectors();
