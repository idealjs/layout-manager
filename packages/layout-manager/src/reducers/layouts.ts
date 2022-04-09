import { createEntityAdapter, createSlice } from "@idealjs/entity";

import { ILayoutNode } from "../type";

export const adapter = createEntityAdapter<ILayoutNode>();

const slice = createSlice({
    name: "layouts",
    initialState: adapter.getInitialState(),
    reducers: {
        updateMany: adapter.updateMany,
        setAll: adapter.setAll,
    },
});

export const { selectById, selectAll } = adapter.getSelectors();

export const { updateMany, setAll } = slice.actions;

export default slice.reducer;
