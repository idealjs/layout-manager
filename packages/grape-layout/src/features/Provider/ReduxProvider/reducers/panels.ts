import { IPanelNode } from "@idealjs/layout-manager";
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const adapter = createEntityAdapter<IPanelNode>();

const slice = createSlice({
    name: "panels",
    initialState: adapter.getInitialState(),
    reducers: {
        updateOne: adapter.updateOne,
        removeOne: adapter.removeOne,
        setAll: adapter.setAll,
    },
});

const { selectById, selectAll } = adapter.getSelectors();

const { setAll } = slice.actions;

export default slice.reducer;

export const usePanels = () => {
    return useSelector((state) => {
        return selectAll(state.panels);
    });
};

export const usePanel = (nodeId: string) => {
    return useSelector((state) => {
        return selectById(state.panels, nodeId);
    });
};

export const useSetAllPanels = () => {
    const dispatch = useDispatch();
    return useCallback(
        (panels: IPanelNode[]) => {
            dispatch(setAll(panels));
        },
        [dispatch]
    );
};
