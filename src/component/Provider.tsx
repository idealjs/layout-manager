import { AnyAction, EntityState } from "@reduxjs/toolkit";
import React, { createContext, FC, useEffect, useReducer } from "react";

import reducer, { adapter, INode, setAll } from "../reducer/nodes";

export const context = createContext<
    [EntityState<INode>, React.Dispatch<AnyAction>] | null
>(null);

const Provider: FC<{ value: INode[] }> = (props) => {
    const { value, children } = props;
    const [state, dispatch] = useReducer(reducer, adapter.getInitialState());

    useEffect(() => {
        dispatch(setAll(value));
    }, [value]);
    return (
        <context.Provider value={[state, dispatch]}>
            {children}
        </context.Provider>
    );
};

export default Provider;
