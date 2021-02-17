import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

import { IPanelNode } from "./type";

export const adapter = createEntityAdapter<IPanelNode>();

const slice = createSlice({
    name: "panels",
    initialState: adapter.getInitialState(),
    reducers: {
        updateOne: adapter.updateOne,
        setAll: adapter.setAll,
    },
});

export const { selectById, selectAll } = adapter.getSelectors();

export const { updateOne, setAll } = slice.actions;

export default slice.reducer;