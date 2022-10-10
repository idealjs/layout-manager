import { ILayoutNode } from "@idealjs/layout-manager";
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const adapter = createEntityAdapter<ILayoutNode>();

const slice = createSlice({
    name: "layouts",
    initialState: adapter.getInitialState(),
    reducers: {
        updateMany: adapter.updateMany,
        setAll: adapter.setAll,
    },
});

const { selectById, selectAll } = adapter.getSelectors();

const { setAll } = slice.actions;

export default slice.reducer;

export const useLayouts = () => {
    return useSelector((state) => {
        return selectAll(state.layouts);
    });
};

export const useLayout = (nodeId: string) => {
    return useSelector((state) => {
        return selectById(state.layouts, nodeId);
    });
};

export const useSetAllLayouts = () => {
    const dispatch = useDispatch();
    return useCallback(
        (layouts: ILayoutNode[]) => {
            dispatch(setAll(layouts));
        },
        [dispatch]
    );
};
