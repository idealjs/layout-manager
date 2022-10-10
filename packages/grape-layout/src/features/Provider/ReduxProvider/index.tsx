import { configureStore } from "@reduxjs/toolkit";
import { PropsWithChildren } from "react";
import { Provider } from "react-redux";

import layouts from "./reducers/layouts";
import panels from "./reducers/panels";
import splitters from "./reducers/splitters";

export const store = configureStore({
    reducer: {
        layouts,
        panels,
        splitters,
    },
});

const ReduxProvider = (props: PropsWithChildren<{}>) => {
    const { children } = props;
    return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;

export type RootState = ReturnType<typeof store.getState>;

export * from "./reducers/layouts";
export * from "./reducers/panels";
export * from "./reducers/splitters";
