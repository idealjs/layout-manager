import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

import { IWidgetNode } from "./type";

export const adapter = createEntityAdapter<IWidgetNode>();

const slice = createSlice({
    name: "widgets",
    initialState: adapter.getInitialState(),
    reducers: {
        setAll: adapter.setAll,
    },
});

export const { selectById, selectAll } = adapter.getSelectors();

export const { setAll } = slice.actions;

export default slice.reducer;
