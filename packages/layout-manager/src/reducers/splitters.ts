import { createEntityAdapter, createSlice } from "@idealjs/entity";

import { ISplitterNode } from "../type";

export const adapter = createEntityAdapter<ISplitterNode>();

const slice = createSlice({
    name: "splitters",
    initialState: adapter.getInitialState(),
    reducers: { setAll: adapter.setAll },
});

export const { selectById, selectAll } = adapter.getSelectors();

export const { setAll } = slice.actions;

export default slice.reducer;
