import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export enum NODE_TYPE {
    LAYOUT_NODE = "LAYOUT_NODE",
    PANEL = "PANEL",
}

export enum DIRECTION {
    COLUMN = "column",
    ROW = "row",
    TAB = "tab",
}

export type TABCMPT = ForwardRefExoticComponent<
    {
        nodeId: string;
        nodeTitle: string;
        onClose: () => void;
        onSelect: () => void;
    } & RefAttributes<HTMLDivElement>
>;

export interface IBaseNode {
    id: string;
    type: NODE_TYPE;
    parentId: string;
}

export interface IPanelNode extends IBaseNode {
    page: string;
    selected: boolean;
    data: any;
}

export interface ILayoutNode extends IBaseNode {
    children: string[];

    direction: DIRECTION;
    offset: number;
    height: number;
    width: number;
}

export type INode = Partial<ILayoutNode> & Partial<IPanelNode> & IBaseNode;

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
