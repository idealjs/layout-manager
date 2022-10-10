import { ISplitterNode } from "@idealjs/layout-manager";
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const adapter = createEntityAdapter<ISplitterNode>();

const slice = createSlice({
    name: "splitters",
    initialState: adapter.getInitialState(),
    reducers: { setAll: adapter.setAll },
});

const { selectById, selectAll } = adapter.getSelectors();

const { setAll } = slice.actions;

export default slice.reducer;

export const useSplitters = () => {
    return useSelector((state) => {
        return selectAll(state.splitters);
    });
};

export const useSplitter = (nodeId: string) => {
    return useSelector((state) => {
        return selectById(state.splitters, nodeId);
    });
};

export const useSetAllSplitters = () => {
    const dispatch = useDispatch();
    return useCallback(
        (splitters: ISplitterNode[]) => {
            dispatch(setAll(splitters));
        },
        [dispatch]
    );
};
