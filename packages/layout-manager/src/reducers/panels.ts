import { createEntityAdapter, createSlice } from "@idealjs/entity";

import { IPanelNode } from "../type";

export const adapter = createEntityAdapter<IPanelNode>();

const slice = createSlice({
    name: "panels",
    initialState: adapter.getInitialState(),
    reducers: {
        updateOne: adapter.updateOne,
        removeOne: adapter.removeOne,
        setAll: adapter.setAll,
    },
});

export const { selectById, selectAll } = adapter.getSelectors();

export const { updateOne, removeOne, setAll } = slice.actions;

export default slice.reducer;
