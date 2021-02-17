import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

import { ISplitterNode } from "./type";

export const adapter = createEntityAdapter<ISplitterNode>();

const slice = createSlice({
    name: "splitters",
    initialState: adapter.getInitialState(),
    reducers: {},
});

export const { selectById, selectAll } = adapter.getSelectors();

export default slice.reducer;
